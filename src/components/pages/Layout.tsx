import React from 'react';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

// Components
import { Header, Providers } from '@components';

// Dictionary
import { getAlternates, getDictionary, LOCALE_HEADER_KEY } from '@dictionary';

// Services
import { InternalServices } from '@utils/services';

interface Props {
    params: { lang: string; reference: string };
    children: React.ReactNode;
}

async function generateMetadata({ params }: Props): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    const title = dictionary['HOME_PAGE_TITLE'];
    const description = dictionary['HOME_PAGE_DESCRIPTION'];
    const bannerURL = new URL(`${InternalServices.getBLOB()}/images/thumbnail.png`);
    const banner = {
        url: bannerURL,
        secureUrl: bannerURL,
        alt: `${dictionary['HOME_PAGE_TITLE']} banner`,
        width: 1920,
        height: 1080,
    };

    return {
        metadataBase: InternalServices.getDeploymentURL(),
        alternates: {
            canonical: headers().get(LOCALE_HEADER_KEY),
            languages: getAlternates(),
        },
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: banner,
            url: InternalServices.getDeploymentURL(dictionary['LANGUAGE_LOCALE_URL']),
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: banner,
            site: process.env.TWITTER_HANDLE ?? undefined,
        },
        other: {
            'google-site-verification': process.env.GOOGLE_VERIFICATION ?? '',
        },
    };
}

async function generatePage({ params, children }: Props) {
    const dictionary = await getDictionary(params.lang);

    return (
        <html lang={dictionary['LANGUAGE_LOCALE']} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>
                    <Header dictionary={dictionary} />
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}

export type { Props };
export { generateMetadata, generatePage };
