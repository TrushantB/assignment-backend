/* eslint @typescript-eslint/no-explicit-any: 0 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("@framework/di/types");
const request_1 = require("./request");
const response_1 = require("./response");
let IMiddleware = class IMiddleware {
    get Request() {
        return this.request;
    }
    set Request(value) {
        this.request = value;
    }
    get Response() {
        return this.response;
    }
    set Response(value) {
        this.response = value;
    }
};
__decorate([
    inversify_1.inject(types_1.default.Request),
    __metadata("design:type", request_1.default)
], IMiddleware.prototype, "request", void 0);
__decorate([
    inversify_1.inject(types_1.default.Response),
    __metadata("design:type", response_1.default)
], IMiddleware.prototype, "response", void 0);
IMiddleware = __decorate([
    inversify_1.injectable()
], IMiddleware);
exports.default = IMiddleware;
//# sourceMappingURL=middleware.js.map