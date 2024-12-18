'use client';

import React from 'react';
import Link from 'next/link';

// Types
import { Dictionary } from '@utils/interfaces';

// Dictionary
import { getClientLocales } from '@dictionary';

// Components
import { HamburguerButton, LanguageButton, ThemeButton } from '@components';

interface Props {
    dictionary: Dictionary;
}

export default function Component({ dictionary }: Props) {
    return (
        <header className='header --flex-row'>
            <Link
                className='header__icon'
                href={`/${dictionary['LANGUAGE_LOCALE_URL']}`}
                scroll={true}
            >
                <svg viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M190.297 98.9669C188.083 102.545 186.237 106.448 184.137 110.167C180.099 117.319 175.608 124.165 170.46 130.107C167.129 133.952 165.207 135.209 162.329 130.392C161.145 128.411 160.182 124.389 157.802 124.212C152.57 123.823 147.43 130.113 144.206 134.376C137.142 143.714 130.892 153.732 123.303 162.487C113.576 173.709 103.025 183.59 90.1615 188.18C84.3292 190.261 77.8413 191.356 71.9743 188.85C62.3771 184.752 66.1483 168.581 68.0782 159.499C74.0357 131.464 87.9953 107.187 106.554 90.0029C114.195 82.9287 122.506 76.5024 131.095 71.4042C134.762 69.2277 139.909 66.647 144.061 65.9161C148.791 65.0832 155.357 66.4662 155.054 74.2093C154.604 85.6719 146.62 94.6102 140.019 101C132.279 108.49 110.127 88.2445 114.347 120.554C118.566 152.863 85.5211 130.107 85.5211 130.107'
                        strokeWidth='10'
                        strokeLinecap='round'
                    />
                </svg>
                <h2>Chicane</h2>
            </Link>
            <LanguageButton dictionary={dictionary} locales={getClientLocales()} />
            <ThemeButton />
            <HamburguerButton />
        </header>
    );
}
