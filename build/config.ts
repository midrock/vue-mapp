import { join } from 'path';

export default {
    root: join(__dirname, '../'),
    themes: join(__dirname, '../themes'),
    es5: join(__dirname, '../es5'),
    src: join(__dirname, '../src'),
    srcThemes: join(__dirname, '../src/themes'),
    devMode: process.env.NODE_ENV === 'dev',
    css: join(__dirname, '../css')
};
