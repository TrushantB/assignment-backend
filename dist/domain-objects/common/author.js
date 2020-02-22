Object.defineProperty(exports, "__esModule", { value: true });
const ddd_1 = require("@framework/ddd");
class Author extends ddd_1.Entity {
    getIsAdmin() {
        return this.isAdmin;
    }
    getName() {
        return this.name;
    }
    toObject() {
        return {
            _id: this.Identifier.toString(),
            name: this.name,
            'is-admin': this.isAdmin,
        };
    }
    static createAuthor(author) {
        const ret = new Author(author._id);
        ret.name = author.name;
        ret.isAdmin = author['is-admin'];
        return ret;
    }
}
exports.default = Author;
//# sourceMappingURL=author.js.map