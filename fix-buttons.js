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

            // Convert "bg-black text-white" to "bg-white text-black border-2 border-black"
            // This ensures "all text color black contrast" even for buttons.
            let newContent = content
                .replace(/bg-black text-white/g, 'bg-white text-black border-2 border-black')
                .replace(/bg-zinc-900\s+text-white/g, 'bg-white text-black border-2 border-black')
                .replace(/bg-gray-900\s+text-white/g, 'bg-white text-black border-2 border-black');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Converted buttons in', fullPath);
            }
        }
    }
}

try {
    processDir('./app');
    processDir('./components');
    console.log('Done converting buttons.');
} catch (_e) {
    console.error(_e);
}
