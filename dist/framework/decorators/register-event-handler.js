Object.defineProperty(exports, "__esModule", { value: true });
/* eslint @typescript-eslint/no-explicit-any: 0 */
require("reflect-metadata");
const event_bus_1 = require("@framework/di/event-bus");
function RegisterEventHandler(EventName) {
    return function decoratorFunction(target) {
        event_bus_1.default.registerHandler(EventName, [target.prototype.constructor.name, target]);
        return target;
    };
}
exports.default = RegisterEventHandler;
//# sourceMappingURL=register-event-handler.js.map