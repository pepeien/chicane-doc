import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Dictionary
import {
    getClientDefaultLocale,
    getServerDefaultLocale,
    getServerLocales,
    LOCALE_HEADER_KEY,
} from '@dictionary';

function parseAcceptLanguage(languageHeaderValue: string | null | undefined): string[] {
    if (!languageHeaderValue || languageHeaderValue.trim().length <= 0) {
        return [];
    }

    return languageHeaderValue
        .split(',')
        .map((lang): [number, string] => {
            const [locale, q = 'q=1'] = lang.split(';');
            const trimmedLocale = locale.trim();
            const numQ = Number(q.replace(/q ?=/, ''));
            return [isNaN(numQ) ? 0 : numQ, trimmedLocale];
        })
        .sort(([q1], [q2]) => q2 - q1)
        .flatMap(([_, locale]) => {
            if (locale === '*') {
                return [];
            }

            return locale.toLowerCase().trim() || [];
        });
}

function getDefaultLocale(headers: Headers): string {
    const availabeLocales = getServerLocales();
    const acceptedLocales = parseAcceptLanguage(headers.get('accept-language'));

    for (const acceptedLocale of acceptedLocales) {
        for (const [key, value] of Object.entries(availabeLocales)) {
            if (acceptedLocale === key) {
                return availabeLocales[key];
            }

            if (acceptedLocale === value) {
                return value;
            }
        }
    }

    return getServerDefaultLocale();
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = Object.values(getServerLocales()).some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    const nextHeaders = request.headers;

    if (pathnameHasLocale) {
        const splittedPathName = pathname.split('/');

        nextHeaders.append(LOCALE_HEADER_KEY, splittedPathName[1]);

        return NextResponse.rewrite(request.nextUrl, {
            headers: nextHeaders,
        });
    }

    nextHeaders.append(LOCALE_HEADER_KEY, getClientDefaultLocale());

    if (!pathname.match('/((?!api|static|.*\\..*|_next).*)')) {
        return NextResponse.rewrite(request.nextUrl, {
            headers: nextHeaders,
        });
    }

    request.nextUrl.pathname = `/${getDefaultLocale(request.headers)}/${pathname}`;

    return NextResponse.redirect(request.nextUrl, {
        headers: nextHeaders,
    });
}

export const config = {
    matcher: '/((?!api|static|_next).*)',
};
