Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const event_registry_1 = require("@framework/di/event-registry");
const inversify_1 = require("inversify");
function RegisterEvent(EventName) {
    return function decoratorFunction(target) {
        event_registry_1.default.registerEvent(EventName, target);
        return inversify_1.injectable()(target);
    };
}
exports.default = RegisterEvent;
//# sourceMappingURL=register-event.js.map