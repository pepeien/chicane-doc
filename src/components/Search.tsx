'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Types
import { Dictionary, Reference } from '@utils/interfaces';

interface Props {
    dictionary: Dictionary;
    references: Reference[];
}

interface FilteredReference {
    title: string;
    path: string;
}

export default function Component({ dictionary, references }: Props) {
    const search = useSearchParams().get('search');

    const [convertedReferences, setConvertedReference] = React.useState<FilteredReference[]>([]);
    const [filteredReferences, setFilteredReferences] = React.useState<FilteredReference[]>([]);
    const [searchText, setSearchText] = React.useState<string>(search ?? '');

    const convertReferences = (source: Reference[], path: string = ''): void => {
        const nextResult = convertedReferences;

        for (const reference of source) {
            const nextReference = {
                title: reference.title,
                path: path.trim().length > 0 ? `${path}/${reference.path}` : reference.path,
            };
            nextResult.push(nextReference);

            setConvertedReference(nextResult);

            convertReferences(reference.children ?? [], nextReference.path);
        }
    };

    const filterReferences = () => {
        if (!search || search.trim().length === 0) {
            return;
        }

        const nextFilteredReferences = [];

        for (let reference of convertedReferences) {
            if (!reference.path.includes(search) && !reference.title.includes(search)) {
                continue;
            }

            nextFilteredReferences.push(reference);
        }

        setFilteredReferences(nextFilteredReferences);
    };

    const onFilter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        const value = searchText.trim();

        if (value.length === 0) {
            window.location.href = dictionary['LANGUAGE_LOCALE_URL'];

            return;
        }

        window.location.href = `${dictionary['LANGUAGE_LOCALE_URL']}?search=${value}`;
    };

    React.useEffect(() => {
        convertReferences(references);
        filterReferences();
    }, []);

    return (
        <React.Fragment>
            <h1 className='home__title'>{dictionary['HOME_PAGE_TITLE']}</h1>
            <h3 className='home__description'>{dictionary['HOME_PAGE_DESCRIPTION']}</h3>
            <div className='search__bar'>
                <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
                <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.currentTarget.value)}
                    onKeyDown={onFilter}
                ></input>
            </div>
            <ul className='search__items'>
                {filteredReferences.map((reference) => (
                    <li key={reference.path}>
                        <Link
                            className='search__item'
                            href={`${dictionary['LANGUAGE_LOCALE_URL']}/reference/${reference.path}`}
                        >
                            <span className='search__item__header'>{reference.title}</span>
                            <span className='search__item__namespace'>
                                {reference.path.replaceAll('/', '::')}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
}
