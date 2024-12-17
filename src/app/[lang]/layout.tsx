import React from 'react';
import type { Metadata } from 'next';

// Pages
import { Layout } from '@pages';

export async function generateMetadata(params: Layout.Props): Promise<Metadata> {
    return Layout.generateMetadata(params);
}

export default async function RootLayout(params: Layout.Props) {
    return Layout.generatePage(params);
}
