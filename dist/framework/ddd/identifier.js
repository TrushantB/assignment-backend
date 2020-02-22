Object.defineProperty(exports, "__esModule", { value: true });
class Identifier {
    constructor(id) {
        this.val = id.toLowerCase();
    }
    get Value() {
        return this.val;
    }
    equals(other) {
        return this.val === other.Value;
    }
    valueOf() {
        return this.val.valueOf();
    }
    toString() {
        return this.val.toString();
    }
}
exports.default = Identifier;
//# sourceMappingURL=identifier.js.map