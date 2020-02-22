Object.defineProperty(exports, "__esModule", { value: true });
const api_controller_1 = require("@framework/interfaces/api-controller");
function Route(method, endpoint) {
    return function decoratorFunction(target, propertyKey, propertyDescriptor) {
        if (!(target instanceof api_controller_1.default)) {
            throw new TypeError('ApiAction decorator is only valid on targets of type IApiController');
        }
        if (!propertyKey.endsWith('Action')) {
            throw new TypeError('Action names must end with \'Action\'');
        }
        Reflect.defineMetadata('action:method', method.toLowerCase(), target, propertyKey);
        Reflect.defineMetadata('action:endpoint', endpoint, target, propertyKey);
        return propertyDescriptor;
    };
}
exports.default = Route;
//# sourceMappingURL=route.js.map