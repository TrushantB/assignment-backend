Object.defineProperty(exports, "__esModule", { value: true });
const api_action_1 = require("./api-action");
const route_1 = require("./route");
const api_permission_1 = require("./api-permission");
const middleware_1 = require("./middleware");
function ExtApiAction(method, endpoint, actionParameters, // eslint-disable-line
permissions, authenticate = true, middleware) {
    return function decoratorFunction(target, propertyKey, propertyDescriptor) {
        const ApiActionDecorator = api_action_1.default(actionParameters);
        const RouteDecorator = route_1.default(method, endpoint);
        let result = propertyDescriptor;
        if (authenticate && Boolean(process.env.DEBUG) === false) {
            result = middleware_1.default('Authentication')(target, propertyKey, result);
        }
        if (permissions) {
            result = api_permission_1.default(permissions)(target, propertyKey, result);
        }
        if (typeof middleware !== 'undefined' && Array.isArray(middleware) && middleware.length > 0) {
            middleware.forEach((name) => {
                result = middleware_1.default(name)(target, propertyKey, result);
            });
        }
        return ApiActionDecorator(target, propertyKey, RouteDecorator(target, propertyKey, result));
    };
}
exports.default = ExtApiAction;
//# sourceMappingURL=extended-api-action.js.map