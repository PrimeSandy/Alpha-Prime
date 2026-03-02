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
            // Regex to remove dark: modifier classes, including any leading spaces.
            let newContent = content.replace(/\s*dark:[a-zA-Z0-9\-\/\[\]#:]+/g, '');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated', fullPath);
            }
        }
    }
}

try {
    processDir('./app');
    processDir('./components');
    console.log('Done stripping dark mode classes.');
} catch (_e) {
    console.error(_e);
}
