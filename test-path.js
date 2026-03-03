const fs = require('fs');
if (fs.existsSync('.netlify/functions-internal/___netlify-server-handler/___netlify-server-handler.mjs')) {
    const c = fs.readFileSync('.netlify/functions-internal/___netlify-server-handler/___netlify-server-handler.mjs', 'utf8');
    const lines = c.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Desktop')) {
            console.log(`Line ${i}:`, JSON.stringify(lines[i]));
        }
    }
} else {
    console.log("File not found");
}
