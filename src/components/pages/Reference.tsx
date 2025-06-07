import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { v4 } from 'uuid';

// Dictionary
import { getDictionary } from '@dictionary';

// Types
import {
    Dictionary,
    Reference,
    ReferenceEnum,
    ReferenceFunction,
    ReferenceMember,
    ReferenceType,
    ReferenceTypeDef,
} from '@utils/interfaces';

// Components
import { Navigator } from '@components';

// Services
import { InternalServices, StringServices } from '@utils/services';

interface Props {
    params: { lang: string; reference: string[] };
}

async function generateMetadata({ params }: Props): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    const title = dictionary['HOME_PAGE_TITLE'];
    const description = dictionary['HOME_PAGE_DESCRIPTION'];
    const bannerURL = new URL(`${InternalServices.getBLOB()}/images/thumbnail.png`);
    const banner = {
        url: bannerURL,
        secureUrl: bannerURL,
        alt: `${dictionary['HOME_PAGE_TITLE']} banner`,
        width: 1920,
        height: 1080,
    };

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: banner,
            url: InternalServices.getDeploymentURL(dictionary['LANGUAGE_LOCALE_URL']),
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: banner,
            site: process.env.TWITTER_HANDLE ?? undefined,
        },
    };
}
function getHeaders(value: string): string[] {
    if (!value || value.trim().length <= 0) {
        return [];
    }

    return value.split(',');
}

function generateTypeDefsTable(
    dictionary: Dictionary,
    title: string,
    headers: string,
    typeReferenceDefs: ReferenceTypeDef[],
) {
    if (typeReferenceDefs.length <= 0) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <React.Fragment>
            <h2>{dictionary[title]}</h2>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            {getHeaders(dictionary[headers]).map((header) => (
                                <th key={v4()}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {typeReferenceDefs.map((value) => (
                            <tr key={v4()}>
                                <td>
                                    <div>{value.name}</div>
                                </td>
                                <td>
                                    <div>{generateType(dictionary, value.type)}</div>
                                </td>
                                <td>
                                    <div>{dictionary[value.description]}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

function generateEnumTable(
    dictionary: Dictionary,
    title: string,
    headers: string,
    enumReferences: ReferenceEnum[],
) {
    if (enumReferences.length <= 0) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <React.Fragment>
            <h2>{dictionary[title]}</h2>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            {getHeaders(dictionary[headers]).map((header) => (
                                <th key={v4()}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {enumReferences.map((value) => (
                            <tr key={v4()}>
                                <td>
                                    <div>{value.name}</div>
                                </td>
                                <td>
                                    <div>{dictionary[value.description]}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

function generateType(dictionary: Dictionary, typeReference: ReferenceType) {
    const isReference = typeReference.path.trim().length > 0;
    const hasTemplate = typeReference.templates.length > 0;

    const hasPrefix = typeReference.prefix.trim().length > 0;
    const hasSuffix = typeReference.suffix.trim().length > 0;

    return (
        <React.Fragment>
            {hasPrefix ? <span>{typeReference.prefix}&nbsp;</span> : undefined}
            {isReference ? (
                <Link
                    href={`/${StringServices.removeExtraSlashes(
                        `${dictionary['LANGUAGE_LOCALE_URL']}/reference/${typeReference.path}`,
                    )}`}
                >
                    {typeReference.name}
                </Link>
            ) : (
                <span>{typeReference.name}</span>
            )}
            {hasTemplate ? (
                <React.Fragment>
                    <span>&lt;</span>
                    {typeReference.templates.map((_, index) => (
                        <React.Fragment key={v4()}>
                            {generateType(dictionary, _)}
                            {index + 1 < typeReference.templates.length ? (
                                <span>,&nbsp;</span>
                            ) : undefined}
                        </React.Fragment>
                    ))}
                    <span>&gt;</span>
                </React.Fragment>
            ) : undefined}
            {hasSuffix ? <span>{typeReference.suffix}</span> : undefined}
        </React.Fragment>
    );
}

function generateFunctionName(dictionary: Dictionary, functionReference: ReferenceFunction) {
    return (
        <React.Fragment>
            <span>{functionReference.name}(</span>
            {functionReference.parameters.map((parameter, index) => (
                <div key={v4()}>
                    {generateType(dictionary, parameter.type)}
                    <span>&nbsp;{parameter.name}</span>
                    {index + 1 < functionReference.parameters.length ? (
                        <span>,&nbsp;</span>
                    ) : undefined}
                </div>
            ))}
            <span>)</span>
        </React.Fragment>
    );
}

function generateInitializers(
    dictionary: Dictionary,
    title: string,
    headers: string,
    functionReferences: ReferenceFunction[],
) {
    if (functionReferences.length <= 0) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <React.Fragment>
            <h2>{dictionary[title]}</h2>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            {getHeaders(dictionary[headers]).map((header) => (
                                <th key={v4()}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {functionReferences.map((functionReference) => (
                            <tr key={v4()}>
                                <td>
                                    <div>{generateFunctionName(dictionary, functionReference)}</div>
                                </td>
                                <td>
                                    <div>{dictionary[functionReference.description]}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

function generateFunctions(
    dictionary: Dictionary,
    title: string,
    headers: string,
    functionReferences: ReferenceFunction[],
) {
    if (functionReferences.length <= 0) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <React.Fragment>
            <h2>{dictionary[title]}</h2>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            {getHeaders(dictionary[headers]).map((header) => (
                                <th key={v4()}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {functionReferences.map((functionReference) => (
                            <tr key={v4()}>
                                <td>
                                    <div>{functionReference.accessor}</div>
                                </td>
                                <td>
                                    <div>{generateType(dictionary, functionReference.return)}</div>
                                </td>
                                <td>
                                    <div>{functionReference.modifiers.join(', ')}</div>
                                </td>
                                <td>
                                    <div>{generateFunctionName(dictionary, functionReference)}</div>
                                </td>
                                <td>
                                    <div>{dictionary[functionReference.description]}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

function generateMembers(
    dictionary: Dictionary,
    title: string,
    headers: string,
    referenceMembers: ReferenceMember[],
) {
    if (referenceMembers.length <= 0) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <React.Fragment>
            <h2>{dictionary[title]}</h2>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            {getHeaders(dictionary[headers]).map((header) => (
                                <th key={v4()}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {referenceMembers.map((referenceMember) => (
                            <tr key={v4()}>
                                <td>
                                    <div>{referenceMember.accessor}</div>
                                </td>
                                <td>
                                    <div>{generateType(dictionary, referenceMember.type)}</div>
                                </td>
                                <td>
                                    <div>{referenceMember.modifiers.join(', ')}</div>
                                </td>
                                <td>
                                    <div>{referenceMember.name}</div>
                                </td>
                                <td>
                                    <div>{dictionary[referenceMember.description]}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

async function generatePage({ params }: Props) {
    const dictionary = await getDictionary(params.lang);

    const blobURL = InternalServices.getBLOB();

    const reference = await fetch(`${blobURL}/references/${params.reference.join('/')}.json`, {
        next: { revalidate: 300 },
    })
        .then((res) => res.json())
        .then((res) => res as Reference)
        .catch(() => undefined);

    if (!reference) {
        return notFound();
    }

    return (
        <React.Fragment>
            <Navigator dictionary={dictionary} location={reference.path} />
            <section className='reference'>
                <ul className='reference__history --flex-row'>
                    {params.reference.map((_path, index) => {
                        const href = `/${StringServices.removeExtraSlashes(
                            `${dictionary['LANGUAGE_LOCALE_URL']}/reference/${params.reference.slice(0, index + 1).join('/')}`,
                        )}`;

                        return (
                            <React.Fragment key={v4()}>
                                <li data-is-active={index >= params.reference.length - 1}>
                                    <Link className='--color-ease-in' href={href}>
                                        {_path}
                                    </Link>
                                </li>
                                {index < params.reference.length - 1 ? <li>::</li> : undefined}
                            </React.Fragment>
                        );
                    })}
                </ul>
                <div className='reference__title --flex-column'>
                    <h1>{reference.title}</h1>
                    {dictionary[reference.source.description] ? (
                        <h2>{dictionary[reference.source.description]}</h2>
                    ) : undefined}
                </div>
                <div className='reference__source --flex-column'>
                    {reference.source.header ? (
                        <div>
                            <div>{dictionary['RESOURCE_HEADER']}</div>
                            <div>{reference.source.header}</div>
                        </div>
                    ) : undefined}
                    {reference.source.namespace ? (
                        <div>
                            <div>{dictionary['RESOURCE_NAMESPACE']}</div>
                            <div>{reference.source.namespace}</div>
                        </div>
                    ) : undefined}
                </div>
                <article className='reference__text markdown'>
                    {generateTypeDefsTable(
                        dictionary,
                        'REFERENCE_TYPE_DEFS',
                        'REFERENCE_TYPE_DEFS_HEADERS',
                        reference.source.types,
                    )}
                    {generateEnumTable(
                        dictionary,
                        'REFERENCE_ENUMS',
                        'REFERENCE_ENUMS_HEADERS',
                        reference.source.enums,
                    )}
                    {generateInitializers(
                        dictionary,
                        'REFERENCE_CONSTRUCTORS',
                        'REFERENCE_CONSTRUCTORS_HEADERS',
                        reference.source.constructors,
                    )}
                    {generateInitializers(
                        dictionary,
                        'REFERENCE_DESTRUCTORS',
                        'REFERENCE_DESTRUCTORS_HEADERS',
                        reference.source.destructors,
                    )}
                    {generateFunctions(
                        dictionary,
                        'REFERENCE_OVERRIDE_FUNCTIONS',
                        'REFERENCE_OVERRIDE_FUNCTIONS_HEADERS',
                        reference.source.functions.filter(
                            (functionReference) => functionReference.type === 'override',
                        ),
                    )}
                    {generateFunctions(
                        dictionary,
                        'REFERENCE_VIRTUAL_FUNCTIONS',
                        'REFERENCE_VIRTUAL_FUNCTIONS_HEADERS',
                        reference.source.functions.filter(
                            (functionReference) => functionReference.type === 'virtual',
                        ),
                    )}
                    {generateFunctions(
                        dictionary,
                        'REFERENCE_STANDARD_FUNCTIONS',
                        'REFERENCE_STANDARD_FUNCTIONS_HEADERS',
                        reference.source.functions.filter(
                            (functionReference) => functionReference.type === 'standard',
                        ),
                    )}
                    {generateMembers(
                        dictionary,
                        'REFERENCE_MEMBERS',
                        'REFERENCE_MEMBERS_HEADERS',
                        reference.source.members,
                    )}
                </article>
            </section>
        </React.Fragment>
    );
}

export type { Props };
export { generateMetadata, generatePage };
