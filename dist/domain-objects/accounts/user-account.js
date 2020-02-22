Object.defineProperty(exports, "__esModule", { value: true });
const ddd_1 = require("@framework/ddd");
class UserAccount extends ddd_1.AggregateRoot {
    getEmail() {
        return this.email;
    }
    getPasswordHash() {
        return this.password;
    }
    static createUserAccount(user) {
        const ret = new UserAccount(String(user._id));
        ret.email = user.email;
        ret.password = user.password;
        return ret;
    }
}
exports.default = UserAccount;
//# sourceMappingURL=user-account.js.map