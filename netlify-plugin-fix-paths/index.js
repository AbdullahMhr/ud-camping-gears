const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.mjs') || fullPath.endsWith('.cjs') || fullPath.endsWith('.js') || fullPath.endsWith('.json')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;

            content = content.replace(/(['"])\\var\\task\\Desktop\\UD Camping Gears/g, "$1/var/task");
            content = content.replace(/(['"])\\\\var\\\\task\\\\Desktop\\\\UD Camping Gears/g, "$1/var/task");

            content = content.replace(/(['"])\/var\/task([^'"]*)(['"])/g, (match, quote1, subPath, quote2) => {
                return quote1 + "/var/task" + subPath.replace(/\\/g, '/') + quote2;
            });

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('[plugin-fix-paths] Fixed', fullPath);
            }
        }
    }
}

module.exports = {
    // onPostBuild runs before deployment starts
    onPostBuild: () => {
        console.log("[plugin-fix-paths] Running paths fix for Netlify Windows bug...");
        try {
            replaceInFiles('.netlify');
            console.log("[plugin-fix-paths] Completed successfully.");
        } catch (e) {
            console.error("[plugin-fix-paths] Error:", e);
        }
    }
}
