var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs = require("fs");
const path = require("path");
const persistence_1 = require("@framework/interfaces/persistence");
class DbContext {
    constructor(collection) {
        this.collection = { nextId: 1, data: [] }; // eslint-disable-line
        try {
            this.fileName = path.join(process.env.ROOTDIR, 'databases', `${collection}.json`);
            const content = fs.readFileSync(this.fileName, 'utf-8');
            this.collection = JSON.parse(content);
        }
        catch (_err) {
            this.collection = {
                nextId: 1,
                data: [],
            };
        }
    }
    /**
     * Find data in the database based on union of criteria.
     * @param criteria Object containing key: value pairs, all of which must match.
     *
     * @returns element contained in the database.
     */
    find(criteria) {
        if (Object.keys(criteria).length === 0) {
            return this.collection.data;
        }
        const ret = []; // eslint-disable-line
        this.collection.data.forEach((element) => {
            const criteriaKeys = Object.keys(criteria);
            const elementKeys = Object.keys(element);
            let add = -1;
            criteriaKeys.forEach((key) => {
                if (elementKeys.indexOf(key) !== -1) {
                    if (element[key] === criteria[key] && add !== 0) {
                        add = 1;
                    }
                    else {
                        add = 0;
                    }
                }
            });
            if (add === 1) {
                ret.push(element);
            }
        });
        return ret;
    }
    /**
     * Save data to the collection
     * @param data The data to be saved to the collection
     */
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const saveData = data;
            saveData._id = Number(saveData._id);
            const index = this.getIndexOf(saveData._id);
            if (index !== -1) {
                this.collection.data[index] = saveData;
            }
            else {
                saveData._id = this.collection.nextId++;
                this.collection.data.push(saveData);
            }
            return saveData;
        });
    }
    /**
     * Store the collection to disk.
     */
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = new Promise((resolve, reject) => {
                fs.writeFile(this.fileName, JSON.stringify(this.collection, null, 2), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
            return ret;
        });
    }
    delete(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const matches = this.find(criteria);
            matches.forEach((match) => {
                const index = this.getIndexOf(match._id);
                if (index !== -1) {
                    this.collection.data.splice(index, 1);
                }
            });
        });
    }
    getIndexOf(criteria) {
        return this.collection.data.findIndex((value) => {
            return value._id === criteria;
        });
    }
}
exports.DbContext = DbContext;
class Db extends persistence_1.default {
    constructor() {
        super(...arguments);
        this.contexts = {};
    }
    getPersistence() {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    getUnderlying() {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    open(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(path.join(process.env.ROOTDIR, 'databases'))) {
                fs.mkdirSync(path.join(process.env.ROOTDIR, 'databases'));
            }
            if (util_1.isUndefined(this.contexts[collection])) {
                this.contexts[collection] = new DbContext(collection);
            }
            return this.contexts[collection];
        });
    }
}
exports.default = Db;
//# sourceMappingURL=db.js.map