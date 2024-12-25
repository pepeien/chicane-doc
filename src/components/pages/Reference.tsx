import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Dictionary
import { getDictionary } from '@dictionary';

// Types
import { Reference } from '@utils/interfaces';

// Components
import { Navigator } from '@components';

// Services
import { InternalServices, StringServices } from '@utils/services';

interface Props {
    params: { lang: string; reference: string[] };
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

    const blobURL = InternalServices.getBLOB();

    const pagePath = params.reference.join('/');
    const fullPath: string[] = [];

    const findReferenceByPath = (references: Reference[], path: string, target: string) => {
        for (let _ of references) {
            const currentPath = `${path}/${_.path}`;

            if (currentPath == `/${target}`) {
                reference = _;

                return;
            }

            findReferenceByPath(_.children ?? [], currentPath, target);
        }
    };

    let reference: Reference | undefined;

    await fetch(`${blobURL}/references/metadata.json`, {
        next: { revalidate: 300 },
    })
        .then((res) => res.json())
        .then((references: Reference[]) => findReferenceByPath(references, '', pagePath))
        .catch(() => [] as Reference[]);

    if (!reference) {
        return notFound();
    }

    const markdownData = await fetch(`${blobURL}/references/${pagePath}/${params.lang}.md`, {
        next: { revalidate: 300 },
    })
        .then((_res) => _res.text())
        .catch(() => undefined);

    if (markdownData === undefined || markdownData.startsWith('<?xml')) {
        return notFound();
    }

    return (
        <React.Fragment>
            <Navigator dictionary={dictionary} location={params.reference.join('/')} />
            <section>
                <ul className='reference__history --flex-row'>
                    {params.reference.map((path) => {
                        fullPath.push(path);

                        const currentPath = fullPath.join('/');
                        const currentHref = StringServices.removeExtraSlashes(
                            `${dictionary['LANGUAGE_LOCALE_URL']}/reference/${fullPath.join('/')}`,
                        );

                        return (
                            <React.Fragment key={currentHref}>
                                <li data-is-active={pagePath === currentPath}>
                                    <Link href={`/${currentHref}`}>{path}</Link>
                                </li>
                                <li>/</li>
                            </React.Fragment>
                        );
                    })}
                </ul>
                <div className='reference__title'>
                    <h1>{reference.title}</h1>
                </div>
                <div className='reference__system'>
                    <span>{params.reference[0]}</span>
                </div>
                <article className='reference__text markdown'>
                    <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                        {markdownData}
                    </Markdown>
                </article>
            </section>
        </React.Fragment>
    );
}

export type { Props };
export { generateMetadata, generatePage };
