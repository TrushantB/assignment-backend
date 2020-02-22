var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const util_1 = require("util");
const response_1 = require("@framework/interfaces/response");
let MockResponse = class MockResponse extends response_1.default {
    setResponse(res) {
        this.res = res;
    }
    get Headers() {
        return this.Headers;
    }
    get StatusCode() {
        return this.res.statusCode;
    }
    get Body() {
        return this.body;
    }
    setHeader(name, value) {
        this.Headers[name] = value;
        return this;
    }
    setStatusCode(code) {
        this.res.statusCode = code;
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    transform() {
        return [this.res, this.body];
    }
    get response() {
        return this.res;
    }
    /* eslint-disable */
    get(key) {
        if (!util_1.isUndefined(this.res[key])) {
            return this.res[key];
        }
        throw new Error(`key '${key}' is undefined.`);
    }
    set(key, value) {
        this.res[key] = value;
        return this;
    }
};
MockResponse = __decorate([
    inversify_1.injectable()
], MockResponse);
exports.default = MockResponse;
//# sourceMappingURL=response.js.map