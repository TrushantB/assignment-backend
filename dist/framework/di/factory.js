/* eslint class-methods-use-this: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
class IFactory {
    create(Type, ...rest) {
        return new Type(...rest);
    }
}
exports.default = IFactory;
//# sourceMappingURL=factory.js.map