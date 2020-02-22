var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const util_1 = require("util");
let IRequest = class IRequest {
    get User() {
        return this.user;
    }
    set User(user) {
        this.user = user;
    }
    get Permissions() {
        return this.permissions;
    }
    set Permissions(permissions) {
        this.permissions = permissions;
    }
    get TokenPayload() {
        return this.tokenPayload;
    }
    set TokenPayload(payload) {
        if (util_1.isUndefined(payload.user) || util_1.isUndefined(payload.permissions)) {
            throw new Error('Invalid token data');
        }
        this.tokenPayload = payload;
        this.user = payload.user;
        this.permissions = payload.permissions;
    }
};
IRequest = __decorate([
    inversify_1.injectable()
], IRequest);
exports.default = IRequest;
//# sourceMappingURL=request.js.map