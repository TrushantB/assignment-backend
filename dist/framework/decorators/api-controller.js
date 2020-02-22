/* eslint no-param-reassign: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
// Api Controller decorator.
// Automatically populates the class' list of available action names.
require("reflect-metadata");
function Module(target) {
    if (!Reflect.hasOwnMetadata('controller:actions', target.prototype)) {
        throw new TypeError(`Error: ${target} has no defined actions.`);
    }
    const actionList = Reflect.getOwnMetadata('controller:actions', target.prototype);
    const actions = {};
    actionList.forEach((actionName) => {
        actions[actionName] = target.prototype[`${actionName}Action`];
    });
    target.prototype.controllerActions = actions;
    return target;
}
exports.default = Module;
//# sourceMappingURL=api-controller.js.map