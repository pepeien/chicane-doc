import React from 'react';
import Link from 'next/link';

// Types
import { Dictionary, Reference } from '@utils/interfaces';

// Services
import { InternalServices, StringServices } from '@utils/services';

interface Props {
    dictionary: Dictionary;
    location: string;
}

export default async function Component({ dictionary, location }: Props) {
    const references: Reference[] = await fetch(
        `${InternalServices.getBLOB()}/references.json`,
    ).then((res) => res.json());

    const getLink = (reference: Reference, currentPath = '') => {
        const path = StringServices.removeExtraSlashes(`${currentPath}/${reference.path}`);
        const href = StringServices.removeExtraSlashes(
            `/${dictionary['LANGUAGE_LOCALE_URL']}/reference/${path}`,
        );
        const hasChildren = reference.children && reference.children.length > 0;
        const isCollapsed =
            !location.includes(StringServices.removeExtraSlashes(path)) || !hasChildren;
        const isCurrentReference = location == path;

        return (
            <li
                key={path}
                data-has-children={hasChildren}
                data-is-collapsed={isCollapsed}
                data-is-current-reference={isCurrentReference}
            >
                <Link className='--flex-row' href={`/${href}`}>
                    <span>{reference.title}</span>
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
                    <ul className='--flex-column'>
                        {reference.children?.map((_) => getLink(_, path))}
                    </ul>
                ) : undefined}
            </li>
        );
    };

    return (
        <nav className='navigator --flex-column'>
            <ul className='--flex-column'>{references.map((reference) => getLink(reference))}</ul>
        </nav>
    );
}
