// Services
import { StringServices, InternalServices, SitemapServices } from '@utils/services';

const now = new Date();

export function GET() {
    const url = StringServices.removeExtraSlashes(InternalServices.getDeploymentURL().toString());
    const alternates = Object.values(SitemapServices.getAlternates(url, '', true));

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
