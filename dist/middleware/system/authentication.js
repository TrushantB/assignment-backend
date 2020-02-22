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
const middleware_1 = require("@framework/interfaces/middleware");
const inversify_1 = require("inversify");
const types_1 = require("@framework/di/types");
const authentication_1 = require("@interfaces/application-services/authentication");
const util_1 = require("util");
const bind_1 = require("@framework/decorators/bind");
let AuthenticationMiddleware = class AuthenticationMiddleware extends middleware_1.default {
    action() {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = this.request.getHeader('Authorization');
            const cookie = this.request.request.cookies[process.env.COOKIENAME];
            // Check secure cookie exists
            if (util_1.isUndefined(cookie)) {
                this.response.setStatusCode(401);
                this.response.setBody({
                    reason: 'Unauthorized',
                });
                return false;
            }
            const encCookiePromise = this.Authentication.createSecureCookieHash(cookie);
            if (util_1.isUndefined(authorization)) {
                this.response.setStatusCode(401);
                this.response.setBody({
                    reason: 'Missing authorization header',
                });
                return false;
            }
            const [scheme, token] = authorization.split(' ');
            if (scheme !== 'Bearer') {
                this.response.setStatusCode(401);
                this.response.setBody({
                    reason: 'Invalid authorization scheme',
                });
                return false;
            }
            try {
                const payloadPromise = this.Authentication.verify(token);
                const encCookie = yield encCookiePromise;
                const payload = yield payloadPromise;
                this.request.TokenPayload = payload;
                if (encCookie !== payload.cookie) {
                    this.response.setStatusCode(401);
                    this.response.setBody({
                        reason: 'Unauthorized',
                    });
                    return false;
                }
            }
            catch (err) {
                this.response.setStatusCode(401);
                this.response.setBody({
                    reason: err.message,
                });
                return false;
            }
            return true;
        });
    }
};
__decorate([
    inversify_1.inject(types_1.default.AuthenticationService),
    __metadata("design:type", authentication_1.default)
], AuthenticationMiddleware.prototype, "Authentication", void 0);
AuthenticationMiddleware = __decorate([
    bind_1.default(types_1.default.Middleware, 'Authentication')
], AuthenticationMiddleware);
exports.default = AuthenticationMiddleware;
//# sourceMappingURL=authentication.js.map