'use server-only';

// Types
import { Dictionary } from '@utils/interfaces';

// Servicesd
import { StringServices } from '@utils/services';

const canonical = 'en';

const serverLocales: Dictionary = {
    en: 'en-us',
    ja: 'ja-jp',
    pt: 'pt-br',
};

const clientLocales: Dictionary = {
    'en-us': 'English (US)',
    'pt-br': 'Português (BR)',
    'ja-jp': '日本語',
};

export const getCanonicalLocale = () => canonical;

export const getServerDefaultLocale = () => serverLocales[canonical];
export const getServerLocales = () => serverLocales;

export const getClientDefaultLocale = () => clientLocales[getServerDefaultLocale()];
export const getClientLocales = () => clientLocales;

export const LOCALE_HEADER_KEY = 'locale';

export const getCanonicalAlternate = (path = '') => {
    return path.trim().length === 0
        ? serverLocales[canonical]
        : `${serverLocales[canonical]}/${path}`;
};

export const getAlternates = (path = '') => {
    const result: { [key: string]: string } = {};

    Object.keys(serverLocales).forEach((key) => {
        result[key] = `${serverLocales[key]}${
            StringServices.isStringValid(path) ? `/${path}` : ''
        }`;
    });

    return result;
};

const dictionaries = {
    'en-us': () => import('./en-us.ts').then((module) => module.default as Dictionary),
    'ja-jp': () => import('./ja-jp.ts').then((module) => module.default as Dictionary),
    'pt-br': () => import('./pt-br.ts').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: string) => {
    const fallbackKey = getServerDefaultLocale() as keyof typeof dictionaries;

    if (!StringServices.isStringValid(locale)) {
        return dictionaries[fallbackKey]();
    }

    const targetKey = locale as keyof typeof dictionaries;

    return dictionaries[!dictionaries[targetKey] ? fallbackKey : targetKey]();
};

export const isValidLocale = (locale: string): boolean => {
    return Object.values(serverLocales).find((_) => _ === locale) !== undefined;
};
