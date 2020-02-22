Object.defineProperty(exports, "__esModule", { value: true });
function Route(name) {
    return function decoratorFunction(target) {
        Reflect.defineMetadata('controller:module', name, target.prototype);
        return target;
    };
}
exports.default = Route;
//# sourceMappingURL=module.js.map