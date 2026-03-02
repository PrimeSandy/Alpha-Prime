/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            let newContent = content
                .replace(/placeholder-gray-400/g, 'placeholder-gray-600')
                .replace(/placeholder-zinc-400/g, 'placeholder-zinc-600')
                .replace(/border-gray-100/g, 'border-gray-300')
                .replace(/border-zinc-100/g, 'border-zinc-300')
                .replace(/bg-gray-100/g, 'bg-gray-200'); // Slightly darken light backgrounds for contrast

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Polished', fullPath);
            }
        }
    }
}

try {
    processDir('./app');
    processDir('./components');
    console.log('Done polishing.');
} catch (_e) {
    console.error(_e);
}
