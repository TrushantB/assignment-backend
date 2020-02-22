Object.defineProperty(exports, "__esModule", { value: true });
const identifier_1 = require("./identifier");
class Entity {
    constructor(id) {
        this._id = typeof id === 'string' ? new identifier_1.default(id) : id;
    }
    get Identifier() {
        return this._id;
    }
    equals(entity) {
        return this._id.equals(entity._id);
    }
}
exports.default = Entity;
//# sourceMappingURL=entity.js.map