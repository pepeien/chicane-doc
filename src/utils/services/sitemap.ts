import { MetadataRoute } from 'next';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';

// Types
import { ReferenceIndex } from '@utils/interfaces';

//Dictionary
import { getCanonicalLocale, getServerLocales } from '@dictionary';

// Services
import { StringServices } from './string';

// Internal
import { InternalServices } from './internal';

type SiteMap = {
    url: string;
    lastModified?: string | Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    alternates?: {
        languages?: Languages<string>;
    };
};

export class SitemapServices {
    public static getAlternates(
        prefix = '',
        suffix = '',
        includeCanonical = true,
    ): { [key: string]: string } {
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
    }

    public static async getReferenceSitemap(
        baseUrl: string,
        url: string,
        now: Date,
        referencePath: string,
    ): Promise<MetadataRoute.Sitemap> {
        const result: MetadataRoute.Sitemap = [];
        result.push({
            url: url,
            lastModified: now,
            changeFrequency: 'daily',
            alternates: {
                languages: SitemapServices.getAlternates(baseUrl),
            },
        } as SiteMap);

        const references: ReferenceIndex[] = await fetch(
            `${InternalServices.getBLOB()}/references/index.json`,
            { cache: 'no-cache' },
        )
            .then((_res) => _res.json())
            .then((res) => res as ReferenceIndex[])
            .catch(() => [] as ReferenceIndex[]);

        const appendReferencesToSitemap = (reference: ReferenceIndex, path = '') => {
            const currentPath = StringServices.removeExtraSlashes(`${path}/${reference.path}`);

            result.push({
                url: `${url}/${currentPath}`,
                lastModified: now,
                changeFrequency: 'daily',
                alternates: {
                    languages: SitemapServices.getAlternates(baseUrl, currentPath),
                },
            } as SiteMap);

            if (!reference.children) {
                return;
            }

            reference.children.forEach((_) => {
                appendReferencesToSitemap(_, path);
            });
        };

        references
            .filter((_) => _.path === referencePath.trim())
            .forEach((_) => {
                appendReferencesToSitemap(_, 'reference');
            });

        return result;
    }
}
