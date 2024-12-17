'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// Types
import { Dictionary } from '@utils/interfaces';

// Services
import { StringServices } from '@utils/services';

interface Props {
    dictionary: Dictionary;
    locales?: Dictionary;
}

export default function Component({ dictionary, locales }: Props) {
    const pathName = usePathname();

    const isLanguageSelected = React.useCallback(
        (langName: string) => {
            return langName === dictionary['LANGUAGE_LOCALE_URL'];
        },
        [dictionary],
    );

    return (
        <nav className='languages --flex-column --fade-in'>
            {locales ? (
                <ul className='languages__list --flex-row'>
                    {Object.entries(locales).map(([id, name]) => (
                        <li
                            key={id}
                            className='--flex-row --bg-color-ease-in'
                            data-is-selected={isLanguageSelected(id)}
                        >
                            <Link
                                href={`/${id}/${StringServices.removeExtraSlashes(
                                    pathName.split(dictionary['LANGUAGE_LOCALE_URL'])[1],
                                )}`}
                                scroll={false}
                            >
                                <span className='--color-ease-in'>{name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : undefined}
        </nav>
    );
}
