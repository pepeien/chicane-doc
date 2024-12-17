import { MetadataRoute } from 'next';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';
import { headers } from 'next/headers';

// Types
import { Reference } from '@utils/interfaces';

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

    const references: Reference[] = await fetch(`${InternalServices.getBLOB()}/references.json`, {
        next: { revalidate: InternalServices.getFetchInterval() },
    })
        .then((_res) => _res.json())
        .catch(() => [] as Reference[]);

    const appendReferencesToSiteMap = (reference: Reference, path = '') => {
        const currentPath = StringServices.removeExtraSlashes(`${path}/${reference.path}`);

        result.push({
            url: `${url}/${currentPath}`,
            lastModified: new Date(),
            alternates: {
                languages: getAlternates(baseUrl, currentPath),
            },
        } as SiteMap);

        if (!reference.children) {
            return;
        }

        reference.children.forEach((_) => {
            appendReferencesToSiteMap(_, currentPath);
        });
    };

    references.forEach((reference) => {
        appendReferencesToSiteMap(reference, 'reference');
    });

    return result;
}
