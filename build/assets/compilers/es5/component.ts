import * as path from'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { performance } from 'perf_hooks';
import chalk from 'chalk';
import compileTypescript from '../typescript';
import compilePug from '../pug';
import { compile as postcss } from '../postcss';
import { log, getRelPath } from '../../helpers';
import config from '../../../config';
import { TemplateCompileResult } from '../../types';
import { compileCss } from '../../../es5';

export class Component {
    css: boolean = false;
    name: string = '';

    content = {
        css: '',
        template: '',
        component: '',
        index: ''
    }

    constructor(
        private srcPath: string, 
        private targetPath: string
    ) {}

    get relPath(): string {
        return getRelPath(this.srcPath);
    }

    async compile() {
        this.clear();

        try {
            const compiledTemplate = this.compileTemplate();

            await this.compileStyle();
            this.compileIndex();
            this.compileComponent(compiledTemplate);
            this.final();
            log('success', chalk.cyan(getRelPath(this.targetPath)));
        } catch (err) {
            log('error', err);
        }
    }

    async compileStyle() {
        const relPath = path.join('css', 'index.css');
        const cssSource = this.read(relPath);

        if (cssSource) {

            try {
                const cssCompiled = await postcss(cssSource, {
                    from: path.join(this.srcPath, 'css/index.css'),
                    to: path.join(this.targetPath, 'style.css')
                });

                if (cssCompiled) {
                    this.css = true;
                    this.content.css = cssCompiled;
                }
            } catch (e) {
                log('error', e);
            }
        } else {
            Promise.resolve();
        }
    }

    private compileIndex(): void {
        const indexPath = path.join(this.relPath, 'index.ts');
        const compiledContent = compileTypescript(indexPath);

        this.content.index = compiledContent;
    }

    private compileTemplate(): TemplateCompileResult {
        const content = this.read('template.pug');

        return compilePug(content);
    }

    private compileComponent(template: TemplateCompileResult): void {
        const cmpPath = path.join(this.relPath, 'component.ts');
        
        let tsCompiled = compileTypescript(cmpPath).replace(
            'Component({',
            `Component({ staticRenderFns: ${template.staticRender}, render() {${template.render}},`
        );

        this.content.component = tsCompiled;
    }

    private read(fileName: string): string {
        const _path = path.join(this.srcPath, fileName);

        if (fs.existsSync(_path)) {
            return fs.readFileSync(_path, 'utf8').toString();
        } else {
            const message = 'Отсутствует файл ' + _path;
            log('error', message)
            throw new Error(message);
        }
    }

    private write(fileName: string, content: string): void {
        const targetFilePath = path.join(this.targetPath, fileName);
        
        log('info', targetFilePath);
        fse.outputFileSync(targetFilePath, content);
    }

    private clear() {
        this.content = {
            css: '',
            template: '',
            component: '',
            index: ''
        }
    }

    private final() {
        const { content } = this;

        if (content.css) {
            this.write('style.css', content.css);
        }
        
        this.write('component.js', content.component);
        this.write('index.js', content.index);
    }
}

export default function(input: string, output: string) {
    const inputFullPath = path.join(config.src, 'components', input);
    const outputFullPath = path.join(config.es5, output);
    const component = new Component(inputFullPath, outputFullPath);

    if (config.devMode) {
        let compiling = false;

        fs.watch(inputFullPath, { 
            recursive: true
        }, async (e, filePath) => {
            if (compiling) return;

            compiling = true;
            await component.compile();

            if (/theme\.css/.test(filePath)) {
                compileCss();
            }

            compiling = false;
        });
    } else {
        setTimeout(() => {
            component.compile();
        });
    }
}
