import { headers } from 'next/headers';

// Types
import { ReferenceIndex } from '@utils/interfaces';

// Dictionary
import { LOCALE_HEADER_KEY } from '@dictionary';

// Services
import { StringServices, InternalServices } from '@utils/services';

const now = new Date();

export async function GET() {
    const baseUrl = `${StringServices.removeExtraSlashes(
        `${InternalServices.getDeploymentURL().toString()}`,
    )}`;
    const url = `${baseUrl}/${headers().get(LOCALE_HEADER_KEY)}`;

    const references: ReferenceIndex[] = await fetch(
        `${InternalServices.getBLOB()}/references/index.json`,
    )
        .then((_res) => _res.json())
        .catch(() => [] as ReferenceIndex[]);

    const xmlContent = references.map((reference) => {
        return `<sitemap><loc>${`${url}/reference/${reference.path}/sitemap.xml`}</loc><lastmod>${now.toISOString()}</lastmod></sitemap>`;
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
