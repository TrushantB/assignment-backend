var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const util_1 = require("util");
const fs = require("fs");
const Express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CookieParser = require("cookie-parser");
const routes_registry_1 = require("@framework/di/routes-registry");
const inversify_config_1 = require("@framework/di/inversify.config");
const bootstrap_events_1 = require("@events/bootstrap-events");
const bootstrap_event_handlers_1 = require("@event-handlers/bootstrap-event-handlers");
const types_1 = require("@framework/di/types");
const envloader_1 = require("./envloader");
const db_1 = require("@framework/database/db");
//CORS: Harish
var cors = require('cors');
bootstrap_events_1.default();
bootstrap_event_handlers_1.default();
// Make an asynchronous start function so we can use await
// for things like interface binding, mongodb and mysql connections etc.
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read ../.env
            envloader_1.default('./config/.env');
            process.env.counter = '0';
            process.env.ROOTDIR = path.resolve(__dirname);
            const apiServer = Express();
            const container = yield inversify_config_1.default();
            container.getNamed(types_1.default.Persistence, 'Db');
            /* Setup body parser */
            apiServer.use(bodyParser.json());
            apiServer.use(CookieParser());
            // Debug printing to the console.
            if (process.env.DEBUG) {
                console.log('Harish: This node env is ', process.env.NODE_ENV);
                apiServer.use(cors());
                // if (process.env.NODE_ENV == 'prod') {
                //   apiServer.use(cors())
                //   console.log('Harish:  CORS set ', process.env.NODE_ENV)
                // }
                apiServer.use('*', (req, _res, next) => {
                    process.stdout.write(`Saw ${req.method} request to ${req.originalUrl}\n`);
                    next();
                });
            }
            // Read and resolve API routes
            const router = routes_registry_1.default.Router;
            process.stdout.write(`Found routes:\n${JSON.stringify(routes_registry_1.default.Routes, null, 2)}\n`);
            apiServer.use('/', router);
            /* Setup error handlers */
            apiServer.use('*', (req, res, _next) => {
                if (util_1.isUndefined(process.env.DEBUG)) {
                    fs.writeFileSync('logs/error.log', `${req.url} not found.\n`, { encoding: 'utf8', flag: 'a+' });
                }
                else {
                    process.stderr.write(`${req.originalUrl} not found.\n`);
                }
                res.status(404).json({ message: `404: ${req.originalUrl} not found` });
            });
            apiServer.use((err, _req, res, _next) => {
                if (util_1.isUndefined(process.env.DEBUG)) {
                    fs.writeFileSync('logs/error.log', `${err.stack}.\n`, { encoding: 'utf8', flag: 'a+' });
                }
                else {
                    process.stderr.write(`${err.stack}.\n`);
                }
                res.status(500).json({ message: '500 internal server error' });
            });
            if (util_1.isUndefined(process.env.PORT)) {
                process.stderr.write('ERROR: PORT environment variable not set!\n');
            }
            db_1.initDb(function (err) {
                if (err) {
                    throw err; //
                }
                process.stdout.write(`API Up and running on port  ${process.env.PORT} ${process.env.DEBUG ? ' in debug mode' : ''}...\n`);
                apiServer.listen(process.env.PORT || 3000, () => {
                    process.stdout.write('Server running!\n');
                });
            });
        }
        catch (err) {
            process.stderr.write(`Caught exception '${err}'\n${err.stack}`);
        }
    });
}
start();
//# sourceMappingURL=index.js.map