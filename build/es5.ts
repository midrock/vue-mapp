import * as fse from 'fs-extra';
import chalk from 'chalk';
import component from './assets/compilers/es5/component';
import ts from './assets/compilers/es5/script';
import postcss from './assets/compilers/postcss';
import config from './config';
import { log, counters } from './assets/helpers';
import { join } from 'path';

if (config.devMode) {
    log('process', 'DEV MODE');
} else {
    log('process', 'BUILD STARTED')
    fse.emptyDirSync(config.es5);
    fse.emptyDirSync(config.css);
}

component('layout/app', 'layout');
component('layout/layout', 'layout');
component('layout/card', 'card');
component('layout/divider', 'divider');
component('layout/tabs', 'tabs');

component('list/list', 'list');

component('event/dialog', 'dialog');
component('event/loader', 'loader');
component('event/snackbar', 'snackbar');

component('input/button', 'button');
component('input/checkbox', 'checkbox');
component('input/date', 'date');
component('input/field', 'field');
component('input/form', 'form');
component('input/input', 'input');
component('input/radio', 'radio');
component('input/select', 'select');
component('input/option', 'option');
component('input/switch', 'switch');
component('input/toggle', 'toggle');

component('typo/icon', 'icon');
component('typo/tag', 'tag');
component('typo/text', 'text');
component('typo/title', 'title');
component('typo/chip', 'chip');

component('popup/menu', 'menu');
component('popup/modal', 'modal');
component('popup/popup', 'popup');
component('popup/outside', 'outside');

ts('components/input/input-element.ts', 'input-element.js');
ts('helpers/optimize.ts', 'helpers/optimize.js');
ts('helpers/parse.ts', 'helpers/parse.js');
ts('helpers/find.ts', 'helpers/find.js');
ts('helpers/dom.ts', 'helpers/dom.js');
ts('helpers/calc.ts', 'helpers/calc.js');

ts('pack/input.ts', 'pack/input.js');
ts('pack/event.ts', 'pack/event.js');
ts('pack/layout.ts', 'pack/layout.js');
ts('pack/popup.ts', 'pack/popup.js');

export function compileCss() {
    postcss('css/global/helpers.css', 'helpers.css');
    postcss('css/global/html.css', 'html.css');
    postcss('css/global/layout.css', 'layout.css');
    postcss('css/theme-list/indigo/index.css', 'themes/indigo.css');
}

if (config.devMode) {
    const cssSrc = join(config.src, 'css');
    fse.watch(cssSrc, {
        recursive: true
    }, async (e, filePath) => {
        compileCss();
    });
} else {
    compileCss();
}


// вывести резюме с ошибками 
