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

            // Replace light grays/zincs with darker versions for "black contrast"
            // text-zinc-600 -> text-gray-800
            // text-zinc-500 -> text-gray-700
            // text-gray-600 -> text-gray-800
            // text-gray-500 -> text-gray-700
            // text-gray-400 -> text-gray-600

            let newContent = content
                .replace(/text-zinc-600/g, 'text-gray-800')
                .replace(/text-zinc-500/g, 'text-gray-800')
                .replace(/text-zinc-400/g, 'text-gray-700')
                .replace(/text-gray-600/g, 'text-gray-800')
                .replace(/text-gray-500/g, 'text-gray-800')
                .replace(/text-gray-400/g, 'text-gray-700')
                .replace(/text-black\/50/g, 'text-black/80')
                .replace(/text-black\/40/g, 'text-black/70');

            // Remove animation classes that might be hiding text if not properly triggered
            newContent = newContent.replace(/\banimate-enter\b/g, '');
            newContent = newContent.replace(/\bscroll-reveal\b/g, '');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Darkened text in', fullPath);
            }
        }
    }
}

try {
    processDir('./app');
    processDir('./components');
    console.log('Done darkening text colors.');
} catch (_e) {
    console.error(_e);
}
