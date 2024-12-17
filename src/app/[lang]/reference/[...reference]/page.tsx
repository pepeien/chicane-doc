import { Metadata } from 'next';

// Pages
import { Reference } from '@pages';

export async function generateMetadata(params: Reference.Props): Promise<Metadata> {
    return Reference.generateMetadata(params);
}

export default async function Page(params: Reference.Props) {
    return Reference.generatePage(params);
}
