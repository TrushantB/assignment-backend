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
const inversify_1 = require("inversify");
require("reflect-metadata");
const request_1 = require("@framework/interfaces/request");
const response_1 = require("@framework/interfaces/response");
const types_1 = require("@framework/di/types");
const util_1 = require("util");
let IApiController = class IApiController {
    dispatch(action, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.actionParameters[action] === undefined || this.controllerActions[action] === undefined) {
                    throw new Error(`Action ${action} does not exist on Controller ${this.toString()}.`);
                }
                const actionParamKeys = Object.keys(this.actionParameters[action]);
                const actionParameters = Array(actionParamKeys.length); // eslint-disable-line
                for (let index = 0; index < actionParamKeys.length; index++) {
                    const key = actionParamKeys[index];
                    const parameterDefinition = this.actionParameters[action][key];
                    const parameterPassed = parameters[key] !== undefined;
                    if (parameterPassed) {
                        let parameterValue; // eslint-disable-line
                        switch (parameterDefinition.type.toLowerCase()) {
                            case 'string':
                                parameterValue = String(parameters[key]);
                                break;
                            case 'number':
                                parameterValue = Number(parameters[key]);
                                break;
                            case 'array':
                                parameterValue = parameters[key].split(',');
                                break;
                            case 'object':
                                parameterValue = JSON.parse(parameters[key]);
                                break;
                            case 'boolean':
                                parameterValue = Boolean(parameters[key]);
                                break;
                            default:
                                if (parameterDefinition.default !== undefined) {
                                    parameterValue = parameterDefinition.default;
                                }
                                else {
                                    throw new TypeError(`Parameter ${key} passed to action function is of unsupported type.`);
                                }
                        }
                        actionParameters[parameterDefinition.index] = parameterValue;
                    }
                    else {
                        if (parameterDefinition.default === undefined) {
                            actionParameters[parameterDefinition.index] = undefined;
                        }
                        actionParameters[parameterDefinition.index] = parameterDefinition.default;
                    }
                }
                const actionName = action.endsWith('Action') ? action.slice(0, -6) : action;
                const actionFun = this.controllerActions[actionName];
                const propertyKey = actionName.endsWith('Action') ? actionName : `${actionName}Action`;
                let hasPermission = true;
                if (Reflect.hasMetadata('action:permission', this, propertyKey)) {
                    const permissionPath = Reflect.getMetadata('action:permission', this, propertyKey).split('.');
                    let permission = this.request.Permissions;
                    permissionPath.forEach((pathElement) => {
                        const next = (pathElement.startsWith(':')
                            ? actionParameters[this.actionParameters[action][pathElement.slice(1)].index]
                            : pathElement);
                        if (!util_1.isUndefined(permission) || !hasPermission) {
                            if (util_1.isUndefined(permission[next])) {
                                hasPermission = false;
                            }
                            else if (typeof permission[next] === 'boolean') {
                                hasPermission = permission[next];
                            }
                            else {
                                permission = permission[next];
                            }
                        }
                    });
                }
                if (!hasPermission) {
                    this.statusCode = 403;
                    this.body = {
                        message: 'Forbidden action',
                    };
                    return;
                }
                yield actionFun.apply(this, actionParameters);
            }
            catch (err) {
                throw err;
            }
        });
    }
    setActionParameters(name, Parameters) {
        if (this.actionParameters === undefined) {
            this.actionParameters = {};
        }
        this.actionParameters[name] = Parameters;
    }
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
    preDispatch() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => resolve());
        });
    }
    postDispatch() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => resolve());
        });
    }
    set body(value) {
        this.response.setBody(value);
    }
    get body() {
        return this.response.Body;
    }
    set statusCode(code) {
        this.response.setStatusCode(code);
    }
    get statusCode() {
        return this.response.StatusCode;
    }
};
__decorate([
    inversify_1.inject(types_1.default.Request),
    __metadata("design:type", request_1.default)
], IApiController.prototype, "request", void 0);
__decorate([
    inversify_1.inject(types_1.default.Response),
    __metadata("design:type", response_1.default)
], IApiController.prototype, "response", void 0);
IApiController = __decorate([
    inversify_1.injectable()
], IApiController);
exports.default = IApiController;
//# sourceMappingURL=api-controller.js.map