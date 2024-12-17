import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Pages
import { Home } from '@pages';

// Utils
import { isValidLocale } from '@dictionary';

export async function generateMetadata(params: Home.Props): Promise<Metadata> {
    return Home.generateMetadata(params);
}

export default async function Page(props: Home.Props) {
    if (!isValidLocale(props.params.lang)) {
        return notFound();
    }

    return Home.generatePage(props);
}
