Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@framework/di/types");
const bind_1 = require("./bind");
const module_1 = require("./module");
const api_controller_1 = require("./api-controller");
function ExtApiController(moduleName, constant = false) {
    return (target) => {
        const BindDecorator = bind_1.default(types_1.default.ApiController, `${moduleName}/${target.name}`, constant);
        const ModuleDecorator = module_1.default(moduleName);
        return api_controller_1.default(ModuleDecorator(BindDecorator(target)));
    };
}
exports.default = ExtApiController;
//# sourceMappingURL=extended-api-controller.js.map