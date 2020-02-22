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
const util_1 = require("util");
const express_1 = require("express");
const types_1 = require("@framework/di/types");
const rethrow = (error) => {
    if (typeof process.env.DEBUG !== 'undefined') {
        process.stderr.write(`Error thrown: ${error.message}\n${error.stack}\n`);
    }
    else {
        throw error;
    }
};
const asyncRoute = (route) => (req, res, next = rethrow) => {
    Promise.resolve(route(req, res, next)).catch(next);
};
class RoutesRegistry {
    static initialize() {
        try {
            RoutesRegistry.router = express_1.Router();
            RoutesRegistry.router.post('*', (req, res, next) => {
                if (util_1.isUndefined(req.headers['content-type'])
                    || req.headers['content-type'] !== 'application/json') {
                    res.status(400);
                    res.json('{ "success":false, "data": {}, "error": {"code": 400, "message": "Invalid Request"}');
                }
                else {
                    next();
                }
            });
        }
        catch (err) {
            process.stderr.write(`Initialization of router failed: ${err.message}\n${err.stack}\n`);
            throw err;
        }
    }
    static registerController(controller, controllerName, container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof RoutesRegistry.router === 'undefined') {
                    RoutesRegistry.initialize();
                }
                const actions = Reflect.getMetadata('controller:actions', controller);
                const moduleName = Reflect.getMetadata('controller:module', controller);
                actions.forEach((actionName) => {
                    const method = Reflect.getMetadata('action:method', controller, `${actionName}Action`);
                    const endpoint = Reflect.getMetadata('action:endpoint', controller, `${actionName}Action`);
                    const permission = Reflect.getMetadata('action:permission', controller, `${actionName}Action`);
                    let middlewareList = [];
                    if (Reflect.hasMetadata('action:middleware', controller, `${actionName}Action`)) {
                        middlewareList = Reflect.getMetadata('action:middleware', controller, `${actionName}Action`);
                    }
                    let tokenPayload;
                    middlewareList.forEach((middlewareName) => {
                        const url = (`/${process.env.APIROOT}/${moduleName}/${endpoint}`).replace(/\/\//g, '/');
                        RoutesRegistry.Router[method](url, asyncRoute((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                            const middleware = container.getNamed(types_1.default.Middleware, middlewareName);
                            middleware.Request.setRequest(req);
                            if (typeof tokenPayload !== 'undefined') {
                                middleware.Request.TokenPayload = tokenPayload;
                            }
                            middleware.Response.setResponse(res);
                            const result = yield middleware.action();
                            if (result) {
                                if (typeof middleware.Request.TokenPayload !== 'undefined') {
                                    tokenPayload = middleware.Request.TokenPayload;
                                }
                                next();
                            }
                            else {
                                const [response, body] = middleware.Response.transform();
                                if (util_1.isUndefined(body) || Object.keys(body).length === 0) {
                                    response.send();
                                }
                                else {
                                    response.json(body);
                                }
                            }
                        })));
                    });
                    const url = (`/${process.env.APIROOT}/${moduleName}/${endpoint}`).replace(/\/\//g, '/');
                    RoutesRegistry.routes.push(`${method.toUpperCase()} ${url}`);
                    RoutesRegistry.Router[method](url, asyncRoute((req, res) => __awaiter(this, void 0, void 0, function* () {
                        const { params, query } = req;
                        const reqBody = req.body;
                        const ApiController = container.getNamed(types_1.default.ApiController, controllerName);
                        ApiController.Request.setRequest(req);
                        ApiController.Response.setResponse(res);
                        if (typeof tokenPayload !== 'undefined') {
                            ApiController.Request.TokenPayload = tokenPayload;
                        }
                        /*
                          Starting from the right, Object.assign copies all the members
                          of each object into the previous one in the list, overwriting any
                          common keys.
                          In this case, that means our params copy into the list of query variables,
                          the result is copied into the route defaults and the whole thing is
                          placed into an empty object.
                          This way, we can easily apply defaults values to our routes,
                          and get both query string value and route parameters from the same input object.
                        */
                        // preDispatch, and postDispatch are allowed to manipulate the response object freely,
                        // as long as the underlying transform() function can still retrieve
                        // a valid express result at the end.
                        const parameters = Object.assign({}, query, params, reqBody);
                        let allowed = true;
                        if (typeof ApiController.Request.TokenPayload !== 'undefined' && permission !== '') {
                            let ack = ApiController.Request.TokenPayload.permissions; // eslint-disable-line
                            permission.split('.').forEach((path) => {
                                if (typeof ack === 'undefined' || ack[path] === false) {
                                    allowed = false;
                                }
                                if (path && path[0] === ':' && typeof parameters[path] !== 'undefined') {
                                    ack = ack[parameters[path]];
                                }
                                else if (path) {
                                    ack = ack[path];
                                }
                            });
                        }
                        if (allowed) {
                            yield ApiController.preDispatch();
                            yield ApiController.dispatch(actionName, parameters);
                            yield ApiController.postDispatch();
                            const [response, body] = ApiController.Response.transform();
                            if (util_1.isUndefined(body) || Object.keys(body).length === 0) {
                                response.send();
                            }
                            else {
                                response.json(body);
                            }
                        }
                        else {
                            res.statusCode = 403;
                            res.json({
                                success: false,
                                data: {
                                    message: 'Unauthorized',
                                },
                            });
                        }
                    })));
                });
            }
            catch (err) {
                process.stderr.write(`Failed to load routes from ${controller}
  Error: ${err.message}
  Stack: ${err.stack}
`);
            }
        });
    }
    static get Router() {
        return RoutesRegistry.router;
    }
    static get Routes() {
        return RoutesRegistry.routes;
    }
}
RoutesRegistry.router = undefined;
RoutesRegistry.routes = [];
exports.default = RoutesRegistry;
//# sourceMappingURL=routes-registry.js.map