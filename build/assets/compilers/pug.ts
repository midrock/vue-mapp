import * as pug from 'pug';
import * as compiler from 'vue-template-compiler';
import { TemplateCompileResult } from '../types';

const transpile = require('vue-template-es2015-compiler');

export default function compilePug(source: string): TemplateCompileResult {
    source = source
        .replace(/\{\s+/g, '{ ')
        .replace(/\[\s+/g, '[ ')
        .replace(/\s*\n\s+\]/g, ' ]')
        .replace(/\s*\n\s+\}/g, ' }')
        .replace(/,\s+/g, ', ');

    let html;

    try {
        html = pug.render(source);
    } catch (e) {
        throw new Error(e);
    }

    const k = compiler.compile(html);

    // prepare for vue-template-es2015-compiler
    let renderScript = 'module.exports={' +
        `render: function(){${k.render}},` +
        `staticRenderFns: [` +
        `${k.staticRenderFns.map(wrapRenderFunction).join(',')}]}`;

    // get correct render functions
    renderScript = transpile(renderScript);

    const finalFunc = renderScript.match(/function\(\)\{(.+)},staticRenderFns:\s(.+)\}$/) || [];

    return {
        render: finalFunc[1],
        staticRender: finalFunc[2]
    };
}

function wrapRenderFunction(code) {
    return `function(){${code}}`
}
