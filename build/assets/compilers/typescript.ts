import * as tsc from 'typescript';
import * as uglify from 'uglify-js';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import config from '../../config';
import { log, getRelPath } from '../helpers';

const tsconfig = require('../../../tsconfig.json');

const tsLocalConfig = {
    baseUrl: config.root,
    target: tsc.ScriptTarget.ES5,
    module: tsc.ModuleKind.CommonJS,
    noImplicitAny: false,
    preserveConstEnums: true,
    experimentalDecorators: true,
    suppressImplicitAnyIndexErrors: true,
    strictNullChecks: true,
    noImplicitThis: true,
    declaration: false,
    paths: tsconfig.compilerOptions.paths,
    "lib": [
        "lib.es6.d.ts",
        "lib.es2015.promise.d.ts"
    ]
};

export const options: tsc.CompilerOptions = {};

function check(path): tsc.Diagnostic[] {
    const program = tsc.createProgram([
        path
    ], tsLocalConfig);

    // let emit = program.emit();

    return tsc.getPreEmitDiagnostics(program)
    // .concat(emit.diagnostics);?
}

function compileTypescript(srcPath: string, options?: tsc.CompilerOptions): string {
    const diags = check(srcPath);

    if (diags.length) {
        const errorText = `Failed to compile ${srcPath}`;
        log('error', errorText);
        logErrors(diags);
        throw new Error(errorText);
    }

    const fullPath = path.join(config.root, srcPath);
    const srcContent = fs.readFileSync(fullPath, 'utf8').toString();

    let output = tsc.transpile(srcContent, {
        ...tsLocalConfig,
        emitDecoratorMetadata: false,
        noEmitHelpers: true,
        importHelpers: true,
    });
        
    const cmpImportReg = /require\(\"component.+\/([^/]+)\"\)/g;

    const result = output.replace(
        cmpImportReg, `require("../$1")`
    ).replace(
        /src\/helpers/g, '../helpers'
    ).replace(
        "css/index.css", "style.css"
    )
    
    return uglify.minify(result).code;
}

function logErrors(diags: tsc.Diagnostic[]) {

    diags.forEach(diagnostic => {

        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            let message = tsc.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

            log('tab', chalk.red(`${getRelPath(diagnostic.file.fileName)} (${line + 1},${character + 1}): ${message}`));
        }
        else {
            console.log(`${tsc.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
    });
}

export default compileTypescript;
