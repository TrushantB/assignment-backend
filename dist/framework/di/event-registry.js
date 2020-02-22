Object.defineProperty(exports, "__esModule", { value: true });
class EventRegistry {
    static registerEvent(Name, fun) {
        EventRegistry._registry[Name] = fun;
    }
    static hasEvent(Name) {
        return typeof EventRegistry._registry[Name] !== 'undefined';
    }
    static getEventConstructor(Name) {
        if (Object.keys(EventRegistry._registry).indexOf(Name) === -1) {
            return false;
        }
        return EventRegistry._registry[Name];
    }
}
exports.default = EventRegistry;
EventRegistry._registry = {};
//# sourceMappingURL=event-registry.js.map