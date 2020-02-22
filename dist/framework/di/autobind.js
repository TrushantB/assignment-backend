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
const path = require("path");
const fs = require("fs");
const api_controller_1 = require("@framework/interfaces/api-controller");
const routes_registry_1 = require("@framework/di/routes-registry");
const types_1 = require("@framework/di/types");
function bind(Constructor, // eslint-disable-line
container) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const constant = Reflect.getMetadata('bind:constant', Constructor);
            const named = Reflect.getMetadata('bind:named', Constructor);
            const name = Reflect.getMetadata('bind:name', Constructor);
            const symbol = Reflect.getMetadata('bind:symbol', Constructor);
            if (constant && named) {
                container.bind(symbol).toConstantValue(new Constructor()).whenTargetNamed(name);
            }
            else if (!constant && named) {
                container.bind(symbol).to(Constructor).whenTargetNamed(name);
            }
            else if (constant && !named) {
                container.bind(symbol).toConstantValue(new Constructor());
            }
            else {
                container.bind(symbol).to(Constructor);
            }
            if (Constructor.prototype instanceof api_controller_1.default) {
                yield routes_registry_1.default.registerController(container.getNamed(types_1.default.ApiController, name), name, container);
            }
        }
        catch (err) {
            throw err;
        }
    });
}
function scanFolder(folderName, container) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allFiles = fs.readdirSync(folderName);
            const scriptFiles = allFiles.filter((name) => {
                return name.indexOf('.map') === -1;
            });
            scriptFiles.forEach((filename) => __awaiter(this, void 0, void 0, function* () {
                if (filename === __filename && filename.indexOf('bindings') !== -1) {
                    return;
                }
                if (fs.statSync(path.join(folderName, filename)).isDirectory()) {
                    scanFolder(path.join(folderName, filename), container);
                }
                else {
                    const target = (yield Promise.resolve().then(() => require(path.join(folderName, filename)))).default;
                    if (typeof target !== 'undefined' && Reflect.hasMetadata('bind:injectable', target)) {
                        yield bind(target, container);
                    }
                }
            }));
        }
        catch (err) {
            throw err;
        }
    });
}
function AutoBind(dirname, container) {
    try {
        const allFiles = fs.readdirSync(dirname);
        const directories = allFiles.filter((name) => {
            return fs.statSync(path.join(dirname, name)).isDirectory();
        });
        directories.forEach((folderName) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield scanFolder(path.join(dirname, folderName), container);
            }
            catch (err) {
                process.stderr.write(`Error in autobind: ${err.message}\n`);
            }
        }));
    }
    catch (err) {
        throw err;
    }
}
exports.default = AutoBind;
//# sourceMappingURL=autobind.js.map