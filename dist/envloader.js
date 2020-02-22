/**
 * Load .env files, formatted with KEY=value pairs.
 * Lines starting with "#" is considered a comment and is not read.
 * All keys are transformed such that "spaced key" becomes "SPACED_KEY".
 *
 * Values are transformed only through trim()
 *
 * Usage: import envLoader from './envloader';
 * envLoader(<file>);
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function envLoader(file = './config/.env') {
    try {
        const data = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
        data.split('\n').forEach((line) => {
            if (line.trim().substr(0, 1) === '#') {
                return;
            }
            const [key, val] = line.split('=');
            if (typeof val === 'undefined') {
                return;
            }
            process.env[key.replace(' ', '_').toUpperCase().trim()] = val.trim();
        });
    }
    catch (err) {
        throw err;
    }
}
exports.default = envLoader;
//# sourceMappingURL=envloader.js.map