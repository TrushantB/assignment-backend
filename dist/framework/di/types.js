// List injectable types here
Object.defineProperty(exports, "__esModule", { value: true });
const TYPES = {
    ApiController: Symbol.for('ApiController'),
    ApplicationService: Symbol.for('ApplicationService'),
    AuthenticationService: Symbol.for('AuthenticationService'),
    DomainService: Symbol.for('DomainService'),
    Event: Symbol.for('Event'),
    EventBus: Symbol.for('EventBus'),
    EventHandler: Symbol.for('EventHandler'),
    Factory: Symbol.for('Factory'),
    Middleware: Symbol.for('Middleware'),
    Persistence: Symbol.for('Persistence'),
    Repository: Symbol.for('Repository'),
    Request: Symbol.for('Request'),
    Response: Symbol.for('Response'),
    Validator: Symbol.for('Validator'),
};
exports.default = TYPES;
//# sourceMappingURL=types.js.map