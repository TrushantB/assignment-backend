/* eslint @typescript-eslint/no-explicit-any: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
class IEvent {
    constructor(EventSpec) {
        this._EventName = EventSpec.name;
        this._Payload = EventSpec.payload;
        this._Timestamp = Object.keys(EventSpec).indexOf('timestamp') === -1 ? Date.now() * 1000 : EventSpec.timestamp;
    }
    get EventName() {
        return this._EventName;
    }
    get Payload() {
        return this._Payload;
    }
    get Timestamp() {
        return this._Timestamp;
    }
    get Serialize() {
        return {
            name: this._EventName,
            payload: this._Payload,
            timestamp: this._Timestamp,
        };
    }
}
exports.default = IEvent;
//# sourceMappingURL=event.js.map