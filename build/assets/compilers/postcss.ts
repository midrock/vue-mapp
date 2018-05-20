import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as postcssrc from 'postcss-load-config';
import * as postcss from 'postcss';
import chalk from 'chalk';
import { log } from '../helpers';
import config from '../../config';

export async function compile(source: string, _options = {}) {
    const { plugins, options } = await postcssrc();
    const result = await postcss(plugins).process(source, 
        {
            ...options,
            ..._options
        });

    return result.css;
}

export default async function (sourcePath, targetPath) {
    const fullSourcePath = path.join(config.src, sourcePath);
    const fullTargetPath = path.join(config.css, targetPath);

    if (!fse.existsSync(fullSourcePath)) {
        log('error', 'File not found ' + fullSourcePath);
        throw new Error();
    }

    const content = fs.readFileSync(fullSourcePath, 'utf8').toString();
    const cssCompiled = await compile(content, {
        from: path.join(fullSourcePath),
        to: path.join(fullTargetPath)
    }); 

    fse.outputFileSync(fullTargetPath, cssCompiled);
    log('success', chalk.blue('css/' + targetPath));
}
