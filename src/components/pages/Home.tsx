import { Metadata } from 'next';
import React from 'react';

// Types
import { Reference } from '@utils/interfaces';

// Dictionary
import { getDictionary } from '@dictionary';

// Components
import { Navigator, Search } from '@components';

// Services
import { InternalServices } from '@utils/services';

interface Props {
    params: { lang: string };
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
    };
}

async function generatePage({ params }: Props) {
    const dictionary = await getDictionary(params.lang);

    const references = await fetch(`${InternalServices.getBLOB()}/references/metadata.json`, {
        next: { revalidate: 0 },
    })
        .then((res) => res.json())
        .catch(() => [] as Reference[]);

    return (
        <React.Fragment>
            <Navigator dictionary={dictionary} location='' />
            <section className='home'>
                <Search dictionary={dictionary} references={references} />
            </section>
        </React.Fragment>
    );
}

export type { Props };
export { generateMetadata, generatePage };
