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
const api_controller_1 = require("@framework/interfaces/api-controller");
const extended_api_controller_1 = require("@framework/decorators/extended-api-controller");
const extended_api_action_1 = require("@framework/decorators/extended-api-action");
const inject_repository_1 = require("@framework/decorators/inject-repository");
const user_repository_1 = require("@interfaces/repositories/user-repository");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const types_1 = require("@framework/di/types");
const authentication_1 = require("@interfaces/application-services/authentication");
const inversify_1 = require("inversify");
const author_repository_1 = require("@interfaces/repositories/author-repository");
const db_1 = require("@framework/database/db");
let LoginController = class LoginController extends api_controller_1.default {
    loginAction(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.users.getUserByEmail(email.toLowerCase());
                if (!user) {
                    this.response.setStatusCode(403);
                    this.response.setBody({
                        data: {
                            message: 'Invalid Credentials',
                        },
                    });
                }
                else if (bcrypt.compareSync(password, user.getPasswordHash())) {
                    const author = yield this.userNames.getAuthor(user.Identifier.toString());
                    const cookieString = crypto.pseudoRandomBytes(16).toString('hex');
                    const cookie = this.auth.createSecureCookieHash(cookieString);
                    this.response.response.cookie(process.env.COOKIENAME, cookieString, {
                        httpOnly: true,
                        secure: true,
                    });
                    const token = this.auth.createToken(user.Identifier.toString(), {
                        user: {
                            _id: author.Identifier.toString(),
                            name: author.getName(),
                            'is-admin': author.getIsAdmin(),
                        },
                        cookie: yield cookie,
                        permissions: {
                            messages: {
                                read: true,
                                write: true,
                                delete: true,
                            },
                        },
                    }, false);
                    const refreshToken = this.auth.createToken(user.Identifier.toString(), { userId: author.Identifier.toString() }, true);
                    this.response.setBody({
                        data: {
                            token: yield token,
                            refreshToken: yield refreshToken,
                            cookie: yield cookie,
                        },
                    });
                    this.response.setStatusCode(200);
                }
                else {
                    this.response.setStatusCode(403);
                    this.response.setBody({
                        data: {
                            message: 'Invalid Credentials',
                        },
                    });
                }
            }
            catch (err) {
                this.response.setStatusCode(500);
                this.response.setBody({
                    data: {
                        message: 'Internal server error',
                    },
                });
            }
        });
    }
    registerAction(email, name, password, isAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email
                || email.length === 0
                || !name
                || name.length === 0
                || !password
                || password.length === 0) {
                this.response.setStatusCode(400);
                this.response.setBody({
                    success: false,
                    data: {
                        message: 'Invalid parameters.',
                    },
                });
                return;
            }
            const user = yield this.users.getUserByEmail(email.toLowerCase());
            if (user) {
                this.response.setStatusCode(409);
                this.response.setBody({
                    data: {
                        message: 'Email already in use.',
                    },
                });
            }
            else {
                const pwd = bcrypt.hashSync(password, 5);
                yield db_1.getDb().collection('users').insertOne({
                    'email': email.toLowerCase(),
                    'name': name,
                    'pwd': pwd,
                    'isAdmin': isAdmin
                });
                yield this.users.saveUser(email.toLowerCase(), name, pwd, isAdmin);
            }
        });
    }
    refreshTokenAction(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = (yield this.auth.verify(token));
                const author = yield this.userNames.getAuthor(payload.userId);
                const cookieString = crypto.pseudoRandomBytes(16).toString('hex');
                const cookie = this.auth.createSecureCookieHash(cookieString);
                this.response.response.cookie(process.env.COOKIENAME, cookieString, {
                    httpOnly: true,
                    secure: true,
                });
                const authToken = this.auth.createToken(payload.userId, {
                    user: {
                        _id: author.Identifier.toString(),
                        name: author.getName(),
                        'is-admin': author.getIsAdmin(),
                    },
                    cookie: yield cookie,
                    permissions: {
                        messages: {
                            read: true,
                            write: true,
                            delete: true,
                        },
                    },
                }, false);
                this.response.setBody({
                    data: {
                        token: yield authToken,
                    },
                });
                this.response.setStatusCode(200);
            }
            catch (err) {
                this.response.setBody({
                    data: {
                        message: 'Invalid refresh token',
                    },
                });
                this.response.setStatusCode(401);
            }
        });
    }
};
__decorate([
    inject_repository_1.default('UserRepository'),
    __metadata("design:type", user_repository_1.default)
], LoginController.prototype, "users", void 0);
__decorate([
    inject_repository_1.default('AuthorRepository'),
    __metadata("design:type", author_repository_1.default)
], LoginController.prototype, "userNames", void 0);
__decorate([
    inversify_1.inject(types_1.default.AuthenticationService),
    __metadata("design:type", authentication_1.default)
], LoginController.prototype, "auth", void 0);
__decorate([
    extended_api_action_1.default('post', '', ['email', 'password'], '', false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "loginAction", null);
__decorate([
    extended_api_action_1.default('post', 'register', ['email', 'name', 'password', ['isAdmin', false]], '', false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "registerAction", null);
__decorate([
    extended_api_action_1.default('get', 'refresh-token/:token', ['token'], '', false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "refreshTokenAction", null);
LoginController = __decorate([
    extended_api_controller_1.default('login', false)
], LoginController);
exports.default = LoginController;
//# sourceMappingURL=login.js.map