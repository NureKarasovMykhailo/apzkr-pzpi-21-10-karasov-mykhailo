import * as i18n from 'i18n';
import * as path from "path";

i18n.configure({
    locales: ['en', 'uk'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'uk',
    objectNotation: true,
    register: global
});