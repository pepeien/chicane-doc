import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

// Services
import { InternalServices, SitemapServices, StringServices } from '@utils/services';

// Dictionary
import { LOCALE_HEADER_KEY } from '@dictionary';

const now = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = `${StringServices.removeExtraSlashes(
        `${InternalServices.getDeploymentURL().toString()}`,
    )}`;
    const url = `${baseUrl}/${headers().get(LOCALE_HEADER_KEY)}`;

    return SitemapServices.getReferenceSitemap(baseUrl, url, now, 'Renderer');
}
