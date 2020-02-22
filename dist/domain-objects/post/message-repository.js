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
const message_repository_1 = require("@interfaces/repositories/message-repository");
const named_inject_1 = require("@framework/decorators/named-inject");
const types_1 = require("@framework/di/types");
const bind_1 = require("@framework/decorators/bind");
const persistence_1 = require("@framework/interfaces/persistence");
const message_1 = require("@domain-objects/post/message");
let MessageRepository = class MessageRepository extends message_repository_1.default {
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.persistence.getPersistence();
            const postContext = yield db.open('posts');
            const posts = postContext.find({});
            const ret = [];
            posts.forEach((post) => {
                ret.push(message_1.default.createMessage(post));
            });
            postContext.commit();
            return ret;
        });
    }
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.persistence.getPersistence();
            const postContext = yield db.open('posts');
            const messageObj = yield postContext.save(message.toObject());
            postContext.commit();
            return message_1.default.createMessage(messageObj);
        });
    }
    findMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.persistence.getPersistence();
            const postContext = yield db.open('posts');
            const msg = postContext.find({ _id: Number(id.toString()) });
            if (msg.length !== 0) {
                return message_1.default.createMessage(msg[0]);
            }
            throw new Error('Message not found.');
        });
    }
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.persistence.getPersistence();
            const postContext = yield db.open('posts');
            postContext.delete({ _id: Number(id.toString()) });
            postContext.commit();
        });
    }
};
__decorate([
    named_inject_1.default(types_1.default.Persistence, 'Db'),
    __metadata("design:type", persistence_1.default)
], MessageRepository.prototype, "persistence", void 0);
MessageRepository = __decorate([
    bind_1.default(types_1.default.Repository, 'MessageRepository')
], MessageRepository);
exports.default = MessageRepository;
//# sourceMappingURL=message-repository.js.map