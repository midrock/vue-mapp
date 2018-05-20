import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { 
    LogType, 
    LogCounters, 
    ReqReadParams,
    WatchOptions
} from './types';
import config from '../config';

export const counters: LogCounters = {
    success: 0,
    error: 0
};

export async function reqRead(params: ReqReadParams) {

    const files = fs.readdirSync(params.dir);

    for (let i = 0; i < files.length; i++) {
        const element = files[i];

        const fullPath = params.dir + '/' + element;
        const isDirectory = fs.statSync(fullPath).isDirectory();

        if (isDirectory) {

            if (params.ondir instanceof Function) {
                await params.ondir(fullPath);
            }

            await reqRead({
                ...params,
                dir: fullPath
            })
        } else if (params.onfile instanceof Function) {
            await params.onfile(fullPath);
        }
    }
}

export function checkComponentDir(_path: string): boolean {
    const parsedDirPath = getDir(_path).split('/');

    parsedDirPath.push('component.ts');

    const componentFile = parsedDirPath.join('/');

    return fs.existsSync(componentFile);
}

export function getComponentDir(_path: string): string {

    const dir: string = getDir(_path);

    if (checkComponentDir(dir)) {
        return dir;
    } else if (dir.length > config.src.length) {
        return getComponentDir(path.join(_path, '..'));
    } else {
        return '';
    }
}

export function substr(first: string, second: string) {

    return first.substr(second.length, first.length);
}

export function log(type: LogType, text: string): void {

    switch (type) {
        
        case 'process':
            text = chalk.yellowBright('PROC') + '    -> ' + text;
            break;
        case 'success':
            text = chalk.green('SUCCESS -> ') + text;
            counters.success++;
            break;
        case 'error':
            text = chalk.redBright('ERROR   -> ' + text);
            counters.error++;
            break;
        case 'tab':
            text = '           ' + text
            break;
        default:
            text = chalk.grey('LOG     -> ' + text);
    }

    if (process.env.LOG_LEVEL !== 'debug' && type === 'info') {
        return;
    }

    console.log(text);
}

export function getDir(_path: string) {
    const isDirectory = fs.statSync(_path).isDirectory();

    if (isDirectory) {
        return _path;
    } else {
        const parsedPath = _path.split('/');

        parsedPath.pop();
        return parsedPath.join('/');
    }
}

export function getRelPath(_path) {
    const parsed = _path.split(config.root);
    return parsed[1] || parsed[0];
}

export function watch(options: WatchOptions) {

    if (process.env.NODE_ENV !== 'dev') return;

    fs.watch(options.path, {
        recursive: options.recursive
    }, options.callback)
}