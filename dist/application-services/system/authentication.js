/* eslint class-methods-use-this: 0 */
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
const jwt = require("jsonwebtoken");
const authentication_1 = require("@interfaces/application-services/authentication");
const bind_1 = require("@framework/decorators/bind");
const types_1 = require("@framework/di/types");
const crypto = require("crypto");
const inject_repository_1 = require("@framework/decorators/inject-repository");
const author_repository_1 = require("@interfaces/repositories/author-repository");
let AuthenticationService = class AuthenticationService extends authentication_1.default {
    constructor() {
        super(...arguments);
        // Consider using database store?
        this.invalidTokens = [];
    }
    verify(tokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.invalidTokens.indexOf(tokenString) !== -1) {
                return {};
            }
            return new Promise((resolve, reject) => {
                jwt.verify(tokenString, process.env.JWTSECRET, {
                    algorithms: ['HS512'],
                    issuer: 'Ratt Spar',
                }, (err, payload) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(payload);
                    }
                });
            });
        });
    }
    createToken(userId, payload, refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, process.env.JWTSECRET, {
                    algorithm: 'HS512',
                    expiresIn: refresh ? process.env.JWTREFRESHLIFETIME : process.env.JWTLIFETIME,
                    subject: userId,
                    issuer: 'Ratt Spar',
                }, (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token);
                });
            });
        });
    }
    invalidateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.invalidTokens.push(token);
        });
    }
    createSecureCookieHash(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = new Promise((resolve, reject) => {
                try {
                    const result = crypto.createHmac('sha256', process.env.COOKIEKEY).update(value).digest('base64');
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            });
            return ret;
        });
    }
};
__decorate([
    inject_repository_1.default('UserRepository'),
    __metadata("design:type", author_repository_1.default)
], AuthenticationService.prototype, "users", void 0);
AuthenticationService = __decorate([
    bind_1.default(types_1.default.AuthenticationService)
], AuthenticationService);
exports.default = AuthenticationService;
//# sourceMappingURL=authentication.js.map