/* eslint @typescript-eslint/no-explicit-any: 0 */
// Factory for creation of the correct event types, used primarily by the event bus
Object.defineProperty(exports, "__esModule", { value: true });
const event_registry_1 = require("@framework/di/event-registry");
class EventFactory {
    static create(EventSpec) {
        const constructor = event_registry_1.default.getEventConstructor(EventSpec.name);
        if (!constructor) {
            throw new Error(`No event registered with name ${EventSpec.name}`);
        }
        return new constructor(EventSpec);
    }
}
exports.default = EventFactory;
//# sourceMappingURL=event-factory.js.map