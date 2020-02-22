Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
function NamedInject(symbol, name) {
    return (target, propertyKey) => {
        const injectDecorator = inversify_1.inject(symbol);
        const namedDecorator = inversify_1.named(name);
        namedDecorator(target, propertyKey);
        injectDecorator(target, propertyKey);
    };
}
exports.default = NamedInject;
//# sourceMappingURL=named-inject.js.map