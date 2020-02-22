Object.defineProperty(exports, "__esModule", { value: true });
class ValueObject {
    equals(Other) {
        const myEntries = Object.entries(this);
        const otherEntries = Object.entries(Other);
        let ret = true;
        if (myEntries.length !== otherEntries.length) {
            ret = false;
        }
        else {
            myEntries.forEach((entry) => {
                const index = otherEntries.findIndex((elem) => elem[0] === entry[0]);
                if (index === -1) {
                    ret = false;
                }
                else if (otherEntries[index][1] !== entry[1]) {
                    ret = false;
                }
            });
        }
        return ret;
    }
}
exports.default = ValueObject;
//# sourceMappingURL=value-object.js.map