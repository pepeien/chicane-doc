import React from 'react';
import Link from 'next/link';

// Types
import { Dictionary, ReferenceIndex } from '@utils/interfaces';

// Services
import { InternalServices, StringServices } from '@utils/services';

interface Props {
    dictionary: Dictionary;
    location: string;
}

export default async function Component({ dictionary, location }: Props) {
    const references: ReferenceIndex[] = await fetch(
        `${InternalServices.getBLOB()}/references/index.json`,
        {
            next: { revalidate: InternalServices.getFetchInterval() },
        },
    )
        .then((res) => res.json())
        .catch(() => [] as ReferenceIndex[]);

    const getLink = (reference: ReferenceIndex) => {
        const path = StringServices.removeExtraSlashes(reference.path);
        const href = StringServices.removeExtraSlashes(
            `/${dictionary['LANGUAGE_LOCALE_URL']}/reference/${path}`,
        );
        const hasChildren = reference.children && reference.children.length > 0;
        const isCollapsed = !location.includes(path) || !hasChildren;
        const isCurrentReference = location == path;

        return (
            <li
                key={path}
                data-has-children={hasChildren}
                data-is-collapsed={isCollapsed}
                data-is-current-reference={isCurrentReference}
            >
                <Link className='--flex-row' href={`/${href}`}>
                    <span>{reference.filename}</span>
                    {hasChildren ? (
                        <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M20 15L12 7L4 15'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    ) : undefined}
                </Link>
                {hasChildren ? (
                    <ul className='--flex-column'>{reference.children?.map((_) => getLink(_))}</ul>
                ) : undefined}
            </li>
        );
    };

    return (
        <nav id='navigator' className='navigator --flex-column'>
            <ul className='--flex-column'>{references.map((reference) => getLink(reference))}</ul>
        </nav>
    );
}
