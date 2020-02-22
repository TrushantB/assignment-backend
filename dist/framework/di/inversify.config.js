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
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("@framework/di/types");
const bind_objects_1 = require("@domain-objects/bind-objects");
const bind_middleware_1 = require("@middleware/bind-middleware");
const bind_api_controllers_1 = require("@api/bind-api-controllers");
const bind_domain_services_1 = require("@domain-services/bind-domain-services");
const bind_application_services_1 = require("@application-services/bind-application-services");
const express_1 = require("@framework/adapters/express");
const db_1 = require("@framework/adapters/persistence/db");
function BindInterfaces() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = new inversify_1.Container();
        // Bind default types
        container.bind(types_1.default.Request).to(express_1.Request);
        container.bind(types_1.default.Response).to(express_1.Response);
        container.bind(types_1.default.Persistence).toConstantValue(new db_1.default());
        yield bind_objects_1.default(container);
        yield bind_domain_services_1.default(container);
        yield bind_application_services_1.default(container);
        yield bind_middleware_1.default(container);
        yield bind_api_controllers_1.default(container);
        return container;
    });
}
exports.default = BindInterfaces;
//# sourceMappingURL=inversify.config.js.map