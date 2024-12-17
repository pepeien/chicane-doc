import { Dictionary } from '@utils/interfaces';

export class StringServices {
    public static isStringValid(str?: string): boolean {
        return !(!str || /^\s*$/.test(str));
    }

    public static isURL(url: string): boolean {
        if (!StringServices.isStringValid(url)) {
            return false;
        }

        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))|' + // OR ip (v4) address
                'localhost' + // OR localhost
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', // fragment locator
            'i',
        );

        return pattern.test(url);
    }

    public static firstToUpperCase(target: string): string {
        if (target.length === 1) {
            return target.toUpperCase();
        }

        return target.charAt(0).toUpperCase() + target.slice(1);
    }

    public static removeExtraSlashes(target = ''): string {
        if (!StringServices.isStringValid(target)) {
            return '';
        }

        if (target.trim() === '/') {
            return target.trim();
        }

        return target.replace(/^[\\/]+|[\\/]+$/g, '');
    }

    public static generateElapsedTime(dictionary: Dictionary, time: string) {
        if (!dictionary.DATE_ELAPSED) {
            return time;
        }

        return dictionary.DATE_ELAPSED_LOCATION === 'AFTER'
            ? `${time} ${dictionary.DATE_ELAPSED}`
            : `${dictionary.DATE_ELAPSED} ${time}`;
    }

    public static getLocalizedDate(
        dictionary: Dictionary,
        date?: Date,
        direction = 'normal',
        fallback = '',
    ): string {
        if (!date || !date.toLocaleDateString) {
            return fallback;
        }

        const year = date.toLocaleDateString(dictionary['LANGUAGE_LOCALE_DATE'], {
            year: 'numeric',
        });
        const month = date.toLocaleDateString(dictionary['LANGUAGE_LOCALE_DATE'], {
            month: 'long',
        });

        if (direction === 'normal') {
            return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
        }

        return `${year} ${month.charAt(0).toUpperCase()}${month.slice(1)}`;
    }

    public static getLocalizedElapsedDate(
        dictionary: Dictionary,
        date?: Date,
        fallback = '',
    ): string {
        if (!date || !date.toLocaleDateString) {
            return fallback;
        }

        const MINUTES_ON_HOUR = 60;
        const HOURS_ON_DAY = 24;
        const DAYS_ON_MONTH = 31;
        const MONTHS_ON_YEAR = 12;

        const minutes = Math.ceil(Math.abs(date.getTime() - Date.now()) / 1000 / 60);

        if (minutes < MINUTES_ON_HOUR) {
            return dictionary.DATE_NOW;
        }

        const hours = Math.round(minutes / 60);

        if (hours < HOURS_ON_DAY) {
            return StringServices.generateElapsedTime(
                dictionary,
                `${hours} ${
                    hours <= 1 ? dictionary.DATE_HOUR_LONG : dictionary.DATE_HOUR_LONG_PLURAL
                }`,
            );
        }

        const days = Math.round(hours / 24);

        if (days < DAYS_ON_MONTH) {
            return StringServices.generateElapsedTime(
                dictionary,
                `${days} ${
                    hours <= 1 ? dictionary.DATE_DAY_LONG : dictionary.DATE_DAY_LONG_PLURAL
                }`,
            );
        }

        const months = Math.round(days / 30);

        if (months < MONTHS_ON_YEAR) {
            return StringServices.generateElapsedTime(
                dictionary,
                `${months} ${
                    months <= 1 ? dictionary.DATE_MONTH_LONG : dictionary.DATE_MONTH_LONG_PLURAL
                }`,
            );
        }

        const years = Math.ceil(months / 12);

        return StringServices.generateElapsedTime(
            dictionary,
            `${years} ${years <= 1 ? dictionary.DATE_YEAR_LONG : dictionary.DATE_YEAR_LONG_PLURAL}`,
        );
    }
}
