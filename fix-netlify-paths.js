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

            // We must REPLACE backslashes but KEEP the remainder of the path!
            // Since `\var\task` evaluates to literal vertical tabs inside the file,
            // we must find the text literal exactly as Netlify generated it.

            // Specifically catching `\var\task\Desktop\UD Camping Gears`
            // Instead of stripping it to `/var/task`, we map entirely to `/var/task/Desktop/UD Camping Gears`
            content = content.replace(/(['"])\\var\\task\\Desktop\\UD Camping Gears/g, "$1/var/task/Desktop/UD Camping Gears");
            content = content.replace(/(['"])\\\\var\\\\task\\\\Desktop\\\\UD Camping Gears/g, "$1/var/task/Desktop/UD Camping Gears");

            // Also fix any other paths trailing
            content = content.replace(/(['"])\/var\/task\/Desktop\/UD Camping Gears([^'"]*)(['"])/g, (match, quote1, subPath, quote2) => {
                return quote1 + "/var/task/Desktop/UD Camping Gears" + subPath.replace(/\\/g, '/') + quote2;
            });

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('[plugin-fix-paths] Fixed via correct mapping', fullPath);
            }
        }
    }
}

replaceInFiles('.netlify');
console.log("Path fix complete with correctly mapped internal folders.");
