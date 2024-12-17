// Dictionary
import { getCanonicalLocale, getServerLocales } from '@dictionary';

// Services
import { StringServices, InternalServices } from '@utils/services';

const now = new Date();

const getAlternates = (prefix = '', suffix = '', hasCanonical = false) => {
    const result: { [key: string]: string } = {};

    const canonical = getCanonicalLocale();
    const serverLocales = getServerLocales();
    const locales = hasCanonical
        ? Object.keys(serverLocales)
        : Object.keys(serverLocales).filter((alternate) => alternate !== canonical);

    locales.forEach((key) => {
        result[key] = StringServices.removeExtraSlashes(
            `${prefix}/${serverLocales[key]}/${suffix}`,
        );
    });

    return result;
};

export function GET() {
    const url = StringServices.removeExtraSlashes(InternalServices.getDeploymentURL().toString());
    const alternates = Object.values(getAlternates(url, '', true));

    const xmlContent = alternates.map((alternate) => {
        return `<sitemap><loc>${`${alternate}/sitemap.xml`}</loc><lastmod>${now.toISOString()}</lastmod></sitemap>`;
    });

    const xml =
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlContent}</sitemapindex>`.replaceAll(
            ',',
            '',
        );

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
