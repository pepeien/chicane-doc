import { MetadataRoute } from 'next';

// Services
import { InternalServices } from '@utils/services';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `${InternalServices.getDeploymentURL()}sitemap.xml`,
    };
}
