var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const named_inject_1 = require("@framework/decorators/named-inject");
const types_1 = require("@framework/di/types");
const author_repository_1 = require("@interfaces/repositories/author-repository");
const db_1 = require("@framework/adapters/persistence/db");
const bind_1 = require("@framework/decorators/bind");
const author_1 = require("./author");
let AuthorRepository = class AuthorRepository extends author_repository_1.default {
    getAuthor(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.persistence.getPersistence();
            const authorContext = yield db.open('users');
            const author = authorContext.find({ _id: Number(_id) });
            if (author.length === 0) {
                return undefined;
            }
            return author_1.default.createAuthor(author[0]);
        });
    }
};
__decorate([
    named_inject_1.default(types_1.default.Persistence, 'Db'),
    __metadata("design:type", db_1.default)
], AuthorRepository.prototype, "persistence", void 0);
AuthorRepository = __decorate([
    bind_1.default(types_1.default.Repository, 'AuthorRepository')
], AuthorRepository);
exports.default = AuthorRepository;
//# sourceMappingURL=author-repository.js.map