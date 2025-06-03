// Types
import { Dictionary } from '@utils/interfaces';

export default {
    LANGUAGE: 'English (US)',

    LANGUAGE_LOCALE: 'en',
    LANGUAGE_LOCALE_DATE: 'en-US',
    LANGUAGE_LOCALE_URL: 'en-us',

    DATE_NOW: 'now',
    DATE_YEAR_LONG: 'year',
    DATE_YEAR_LONG_PLURAL: 'years',
    DATE_MONTH_LONG: 'month',
    DATE_MONTH_LONG_PLURAL: 'months',
    DATE_DAY_LONG: 'Day',
    DATE_DAY_LONG_PLURAL: 'days',
    DATE_HOUR_LONG: 'hour',
    DATE_HOUR_LONG_PLURAL: 'hours',
    DATE_ELAPSED: 'ago',
    DATE_ELAPSED_LOCATION: 'AFTER',

    RESOURCE_HEADER: 'Header',
    RESOURCE_NAMESPACE: 'Namespace',
    REFERENCE_TYPE_DEFS: 'Types',
    REFERENCE_TYPE_DEFS_HEADERS: 'Name,Value,Description',
    REFERENCE_ENUMS: 'Values',
    REFERENCE_ENUMS_HEADERS: 'Name,Description',
    REFERENCE_CONSTRUCTORS: 'Constructors',
    REFERENCE_CONSTRUCTORS_HEADERS: 'Name,Description',
    REFERENCE_DESTRUCTORS: 'Destructors',
    REFERENCE_DESTRUCTORS_HEADERS: 'Name,Description',
    REFERENCE_OVERRIDE_FUNCTIONS: 'Override Functions',
    REFERENCE_OVERRIDE_FUNCTIONS_HEADERS: 'Access,Return,Modifier,Name,Description',
    REFERENCE_VIRTUAL_FUNCTIONS: 'Virtual Functions',
    REFERENCE_VIRTUAL_FUNCTIONS_HEADERS: 'Access,Return,Modifier,Name,Description',
    REFERENCE_STANDARD_FUNCTIONS: 'Functions',
    REFERENCE_STANDARD_FUNCTIONS_HEADERS: 'Access,Return,Modifier,Name,Description',
    REFERENCE_MEMBERS: 'Members',
    REFERENCE_MEMBERS_HEADERS: 'Access,Type,Modifier,Name,Description',

    CHICANE_BOX_DESCRIPTION:
        'Box is the asset system, based on the XML format and holds binaries as Base64.',

    CHICANE_GRID_DESCRIPTION:
        'Grid is the UI system, based on a HTML & CSS systems with a parent relationship between its components.',

    HOME_PAGE_TITLE: 'Chicane Engine - Documentation',
    HOME_PAGE_DESCRIPTION: 'Discover how the Chicane Engine works.',

    NOT_FOUND_TEXT: 'Page Not Found',
} as Dictionary;
