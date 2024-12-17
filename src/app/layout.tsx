import React from 'react';
import type { Metadata } from 'next';

// Dictionary
import { getDictionary, getServerDefaultLocale } from '@dictionary';

// Icons
import icons from '@utils/icons';

// Styles
import '@styles/index.scss';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
    const dictionary = await getDictionary(getServerDefaultLocale());

    const title = dictionary['HOME_PAGE_TITLE'];
    const description = dictionary['HOME_PAGE_DESCRIPTION'];

    return {
        title: title,
        description: description,
        icons: icons,
    };
}

export default function Layout({ children }: Props) {
    return <>{children}</>;
}
