/* eslint class-methods-use-this: 0 */
/* eslint @typescript-eslint/no-explicit-any: 0 */
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
const authentication_1 = require("@interfaces/application-services/authentication");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
class MockAuthenticationService extends authentication_1.default {
    constructor() {
        super(...arguments);
        this.invalidTokens = [];
        this.permissions = {};
        this.user = {
            _id: '',
            name: 'Test User',
            title: 'Test Title',
        };
    }
    verify(tokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.invalidTokens.indexOf(tokenString) === -1) {
                return {};
            }
            return new Promise((resolve, reject) => {
                jwt.verify(tokenString, process.env.JWTSECRET, {
                    algorithms: ['HS512'],
                    issuer: 'Ratt Spar',
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        });
    }
    createToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, permissions } = this;
            user._id = userId;
            const payload = Object.assign(user, permissions);
            return jwt.sign(payload, process.env.JWTSECRET, {
                algorithm: 'HS512',
                expiresIn: process.env.JWTLIFETIME,
                subject: userId,
                issuer: 'Ratt Spar',
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
}
exports.default = MockAuthenticationService;
//# sourceMappingURL=mock-authentication.js.map