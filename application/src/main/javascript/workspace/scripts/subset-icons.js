import fs from 'fs-extra';
import { globSync } from 'glob';
import subsetFont from 'subset-font';
import path from 'path';
import { JSDOM } from 'jsdom';

const SRC_FONT = 'projects/technology-speaks/src/material.ttf';
const DEST_DIR = 'projects/technology-speaks/src';
const DEST_NAME = 'material-subset.woff2';

const files = globSync('projects/technology-speaks/src/**/*.html').concat(globSync('projects/shared/src/**/*.html'));

let icons = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const dom = new JSDOM(content);
    const elements = dom.window.document.querySelectorAll('as-icon[value]');
    elements.forEach(el => icons.push(el.getAttribute('value')));
});

const uniqueIcons = Array.from(new Set(icons));
const text = uniqueIcons.join(' ');

fs.ensureDirSync(DEST_DIR);

const fontBuffer = fs.readFileSync(SRC_FONT);

const subsettedFont = await subsetFont(fontBuffer, text, { targetFormat: 'woff2' });
fs.writeFileSync(path.join(DEST_DIR, DEST_NAME), subsettedFont);

console.log(`Subset-Font erzeugt: ${DEST_DIR}/${DEST_NAME}`);
console.log(`Verwendete Icons: ${uniqueIcons.join(', ')}`);
