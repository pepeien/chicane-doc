import { MetadataRoute } from 'next';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';
import { headers } from 'next/headers';

// Types
import { Blog } from '@utils/interfaces';

// Services
import { InternalServices, StringServices } from '@utils/services';

// Dictionary
import { getCanonicalLocale, getServerLocales, LOCALE_HEADER_KEY } from '@dictionary';

type SiteMap = {
    url: string;
    lastModified?: string | Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    alternates?: {
        languages?: Languages<string>;
    };
};

const now = new Date();

const getAlternates = (prefix = '', suffix = '', includeCanonical = true) => {
    const result: { [key: string]: string } = {};

    const canonicalLocale = getCanonicalLocale();
    const availableLocales = getServerLocales();

    const locales = includeCanonical
        ? Object.keys(availableLocales)
        : Object.keys(availableLocales).filter((alternate) => alternate !== canonicalLocale);

    locales.forEach((key) => {
        const locale = availableLocales[key];

        result[locale] = StringServices.removeExtraSlashes(`${prefix}/${locale}/${suffix}`);
    });

    return result;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = `${StringServices.removeExtraSlashes(
        `${InternalServices.getDeploymentURL().toString()}`,
    )}`;
    const url = `${baseUrl}/${headers().get(LOCALE_HEADER_KEY)}`;

    const result: MetadataRoute.Sitemap = [];
    result.push({
        url: url,
        lastModified: now,
        changeFrequency: 'yearly',
        alternates: {
            languages: getAlternates(baseUrl),
        },
    } as SiteMap);

    const releasedBlogPosts = await fetch(`${InternalServices.getBLOB()}/blog/metadata.json`, {
        next: { revalidate: InternalServices.getFetchInterval() },
    })
        .then((_res) => _res.json())
        .then((_blog: Blog[]) => _blog.filter((_post) => _post.status === 'RELEASED'))
        .catch(() => [] as Blog[]);

    if (releasedBlogPosts.length > 0) {
        releasedBlogPosts
            .sort((pastPost, currentPost) => {
                if (pastPost.date === currentPost.date) {
                    return 0;
                }

                if (pastPost.date > currentPost.date) {
                    return 1;
                }

                return -1;
            })
            .forEach((post) => {
                const path = `blog/${post.id}`;

                const blogSitemap = {
                    url: `${url}/${path}`,
                    lastModified: post.updateDate ?? post.date,
                    alternates: {
                        languages: getAlternates(baseUrl, path),
                    },
                } as SiteMap;

                result.push(blogSitemap);
            });
    }

    return result;
}
