Object.defineProperty(exports, "__esModule", { value: true });
/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-implicit-any: 0 */
/* eslint no-param-reassign: 0 */
// Action decorator, takes a param object and type-converts its members
// to match the parameter list of an action function.
require("reflect-metadata");
const api_controller_1 = require("@framework/interfaces/api-controller");
function ApiAction(actionParameters) {
    return function decoratorFunction(target, propertyKey, propertyDescriptor) {
        if (!(target instanceof api_controller_1.default)) {
            throw new TypeError('ApiAction decorator is only valid on targets of type IApiController');
        }
        if (!propertyKey.endsWith('Action')) {
            throw new TypeError('Action names must end with \'Action\'');
        }
        const types = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
        const parameterTypes = types.map((a) => a.name);
        const parameterList = {};
        for (let index = 0; index < actionParameters.length; index++) {
            const parameter = actionParameters[index];
            const parameterDefinition = {
                index,
                type: parameterTypes[index],
            };
            if (typeof parameter === 'string') {
                parameterList[parameter] = parameterDefinition;
            }
            else {
                if (parameter.length === 2) {
                    [, parameterDefinition.default] = parameter;
                }
                parameterList[parameter[0]] = parameterDefinition;
            }
        }
        const actionName = propertyKey.endsWith('Action') ? propertyKey.slice(0, -6) : propertyKey;
        target.setActionParameters(actionName, parameterList);
        let actionList;
        if (Reflect.hasOwnMetadata('controller:actions', target)) {
            actionList = Reflect.getOwnMetadata('controller:actions', target);
            actionList.push(actionName);
        }
        else {
            actionList = [actionName];
        }
        Reflect.defineMetadata('controller:actions', actionList, target);
        return propertyDescriptor;
    };
}
exports.default = ApiAction;
//# sourceMappingURL=api-action.js.map