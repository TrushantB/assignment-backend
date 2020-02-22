Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
function Bind(symbol, name = '', constant = false) {
    return function decoratorFunction(target) {
        if (typeof process.env.TEST !== 'undefined') {
            // Do not auto-bind in test environments.
            return target;
        }
        Reflect.defineMetadata('bind:injectable', true, target);
        if (name !== '') {
            Reflect.defineMetadata('bind:named', true, target);
            Reflect.defineMetadata('bind:name', name, target);
        }
        else {
            Reflect.defineMetadata('bind:named', false, target);
            Reflect.defineMetadata('bind:name', '', target);
        }
        Reflect.defineMetadata('bind:symbol', symbol, target);
        Reflect.defineMetadata('bind:constant', constant, target);
        const Injectable = inversify_1.injectable();
        return Injectable(target);
    };
}
exports.default = Bind;
//# sourceMappingURL=bind.js.map