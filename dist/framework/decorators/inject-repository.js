Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@framework/di/types");
const inversify_1 = require("inversify");
function InjectRepository(name) {
    return (target, // eslint-disable-line
    propertyKey) => {
        const injectDecorator = inversify_1.inject(types_1.default.Repository);
        const namedDecorator = inversify_1.named(name);
        namedDecorator(target, propertyKey);
        injectDecorator(target, propertyKey);
    };
}
exports.default = InjectRepository;
//# sourceMappingURL=inject-repository.js.map