'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Types
import { Dictionary, Reference, ReferenceFile } from '@utils/interfaces';

interface Props {
    dictionary: Dictionary;
    references: Reference[];
}

interface FilteredReference {
    title: string;
    path: string;
    source: ReferenceFile;
}

export default function Component({ dictionary, references }: Props) {
    const search = useSearchParams().get('search');

    const [filteredReferences, setFilteredReferences] = React.useState<FilteredReference[]>([]);
    const [searchText, setSearchText] = React.useState<string>(search ?? '');

    const convertReferences = (source: Reference[], path: string = ''): FilteredReference[] => {
        let result: FilteredReference[] = [];

        for (const reference of source) {
            const nextReference = {
                title: reference.title,
                path: path.trim().length > 0 ? `${path}/${reference.path}` : reference.path,
                source: reference.source,
            };
            result.push(nextReference);

            if (!reference.children) {
                continue;
            }

            result = result.concat(convertReferences(reference.children, nextReference.path));
        }

        return result;
    };

    const filterReferences = (
        target: string,
        references: FilteredReference[],
    ): FilteredReference[] => {
        if (!target) {
            return [];
        }

        const searchText = target.trim().toLowerCase();

        if (searchText.length === 0) {
            return [];
        }

        return references.filter((_) => {
            const path = _.path.toLowerCase();
            const title = _.title.toLowerCase();

            const sourceHeader = _.source.header.toLowerCase();
            const sourceNamespace = _.source.namespace ? _.source.namespace.toLowerCase() : '';

            return (
                path.includes(searchText) ||
                title.includes(searchText) ||
                sourceHeader.includes(searchText) ||
                sourceNamespace.includes(searchText)
            );
        });
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
        const nextReferences = convertReferences(references);

        if (!search || nextReferences.length === 0) {
            return;
        }

        setFilteredReferences(filterReferences(search, nextReferences));
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
                    <li key={`${reference.path}_${reference.source.header}`}>
                        <Link
                            className='search__item'
                            href={`${dictionary['LANGUAGE_LOCALE_URL']}/reference/${reference.path}`}
                        >
                            <div className='search__item__header --flex-row'>
                                <h4>{reference.title}</h4>
                                <span>{reference.source.header}</span>
                            </div>
                            <span className='search__item__namespace'>
                                {reference.source?.namespace}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
}
