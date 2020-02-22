Object.defineProperty(exports, "__esModule", { value: true });
function UseMiddleware(name) {
    return function decoratorFunction(target, propertyKey, propertyDescriptor) {
        if (!propertyKey.endsWith('Action')) {
            throw new TypeError('Middleware can only be placed on API Action methods!');
        }
        let MiddlewareList = [name];
        if (Reflect.hasMetadata('action:middleware', target, propertyKey)) {
            const OldMiddleware = Reflect.getMetadata('action:middleware', target, propertyKey);
            MiddlewareList = MiddlewareList.concat(OldMiddleware.filter((middleware) => {
                return middleware !== name;
            }));
        }
        Reflect.defineMetadata('action:middleware', MiddlewareList, target, propertyKey);
        return propertyDescriptor;
    };
}
exports.default = UseMiddleware;
//# sourceMappingURL=middleware.js.map