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
/* eslint @typescript-eslint/no-explicit-any: 0 */
const path = require("path");
const fs = require("fs");
function RegisterEventHandler(_Type) {
    // No-op; just trigger decorators.
}
exports.default = () => __awaiter(this, void 0, void 0, function* () {
    const allFiles = fs.readdirSync(__dirname);
    const files = allFiles.filter((name) => {
        return name.indexOf('.map') === -1;
    });
    files.forEach((filename) => __awaiter(this, void 0, void 0, function* () {
        RegisterEventHandler(yield Promise.resolve().then(() => require(path.join(__dirname, filename))));
    }));
});
//# sourceMappingURL=bootstrap-event-handlers.js.map