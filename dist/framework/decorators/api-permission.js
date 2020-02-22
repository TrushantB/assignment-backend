Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-param-reassign: 0 */
// Action decorator, takes a param object and type-converts its members
// to match the parameter list of an action function.
require("reflect-metadata");
const api_controller_1 = require("@framework/interfaces/api-controller");
function Module(permission) {
    return function decoratorFunction(target, propertyKey, propertyDescriptor) {
        if (!(target instanceof api_controller_1.default)) {
            throw new TypeError('ApiAction decorator is only valid on targets of type IApiController');
        }
        if (!propertyKey.endsWith('Action')) {
            throw new TypeError('Permissions can only be placed on API Action methods!');
        }
        Reflect.defineMetadata('action:permission', permission, target, propertyKey);
        return propertyDescriptor;
    };
}
exports.default = Module;
//# sourceMappingURL=api-permission.js.map