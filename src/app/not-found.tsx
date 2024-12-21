import React from 'react';

// Dictionary
import { getDictionary, getServerDefaultLocale } from '@dictionary';

// Pages
import { Layout } from '@pages';

export default async function Page() {
    const dictionary = await getDictionary(getServerDefaultLocale());

    return (
        <Layout.generatePage params={{ lang: getServerDefaultLocale() }}>
            <section className='not-found'>
                <div className='not-found__title --flex-row'>
                    <div className='not-found__title__text --flex-column'>
                        <h3>{dictionary['NOT_FOUND_TEXT']}</h3>
                        <h2>404</h2>
                    </div>
                </div>
            </section>
        </Layout.generatePage>
    );
}
