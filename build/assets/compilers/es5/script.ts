import * as path from 'path';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import * as tsc from 'typescript';
import chalk from 'chalk';
import config from '../../../config';
import { log, watch, getRelPath } from '../../helpers';
import tsCompile from '../typescript';

const tsconfig = require('../../../../tsconfig.json')

function compileScript(srcFullPath: string, targetFullPath: string) {

    try {
        const srcCompiled = tsCompile(getRelPath(srcFullPath));

        fse.outputFileSync(targetFullPath, srcCompiled);
        log('success', chalk.blue(getRelPath(targetFullPath)));
    } catch(e) {}
}

export default function(srcPath: string, targetPath: string) {
    const srcFullPath: string = path.join(config.src, srcPath);
    const targetFullPath = path.join(config.es5, targetPath);

    if (!fse.existsSync(srcFullPath)) {
        log('error', 'File not found ' + srcFullPath);
        throw new Error();
    }

    function compile() {
        compileScript(srcFullPath, targetFullPath);
    }

    if (process.env.NODE_ENV === 'dev') {
        fs.watchFile(srcFullPath, {
            interval: 1000
        }, compile);
    } else {
        compile();
    }
}
