/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint no-console: 0 */
/* eslint class-methods-use-this: 0 */
// Class for maintaining an event queue system, with offline-queuing capabilities.
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
var EventBus_1;
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const event_factory_1 = require("@framework/di/event-factory");
const persistence_1 = require("@framework/interfaces/persistence");
let EventBus = EventBus_1 = class EventBus {
    constructor(mongo) {
        EventBus_1.mongo = mongo;
    }
    runEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield EventBus_1.mongo.getUnderlying();
            const session = client.startSession();
            try {
                yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    const db = yield client.db();
                    const queue = yield db.collection('event_queue');
                    const result = queue.find({}, { sort: { timestamp: 1 }, limit: Number(process.env.EVENTMAX) });
                    const events = [];
                    const handledEvents = Object.keys(EventBus_1.handlers);
                    yield result.forEach((doc) => {
                        events.push(doc);
                        queue.deleteOne(doc);
                    });
                    events.forEach((doc) => {
                        if (handledEvents.indexOf(doc.name) !== -1) {
                            const handlerArray = EventBus_1.handlers[doc.name];
                            const event = event_factory_1.default.create(doc);
                            for (let i = 0; i < handlerArray.length; i++) {
                                const propagate = (new handlerArray[i][1]()).handleEvent(event);
                                if (!propagate) {
                                    break;
                                }
                            }
                        }
                    });
                }));
            }
            catch (err) {
                session.abortTransaction();
                process.stderr.write(`Error in eventbus runEvents: ${err.message}\n`);
            }
        });
    }
    startInterval() {
        // setInterval(async (): Promise<void> => this.runEvents(), Number(process.env.EVENTREFRESH));
    }
    static registerHandler(EventName, Handler) {
        const keys = Object.keys(EventBus_1.handlers);
        if (keys.indexOf(EventName) === -1) {
            EventBus_1.handlers[EventName] = [
                Handler,
            ];
        }
        else {
            const index = EventBus_1.handlers[EventName].findIndex((entry) => {
                return entry[0] === Handler[0];
            });
            if (index === -1) {
                EventBus_1.handlers[EventName].push(Handler);
            }
        }
    }
    static getHandlers() {
        return EventBus_1.handlers;
    }
    static deregisterHandler(EventName, HandlerType) {
        const keys = Object.keys(EventBus_1.handlers);
        if (keys.indexOf(EventName) !== -1) {
            const index = EventBus_1.handlers[EventName].findIndex((entry) => {
                return entry[0] === HandlerType;
            });
            if (index === -1) {
                EventBus_1.handlers[EventName].splice(index, 1);
            }
        }
    }
    static emit(EventName, Payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.TEST) {
                EventBus_1.emitLog.push('EventName');
                return;
            }
            const client = yield EventBus_1.mongo.getUnderlying();
            const session = client.startSession();
            try {
                yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    const db = yield client.db();
                    const queue = yield db.collection('event_queue');
                    queue.insertOne({
                        name: EventName,
                        payload: Payload,
                        timestamp: Date.now() * 1000,
                    });
                }));
            }
            catch (err) {
                session.abortTransaction();
                process.stderr.write(`Error emitting event ${EventName}: ${err}\n`);
            }
        });
    }
    static flushLog() {
        const log = EventBus_1.emitLog;
        EventBus_1.emitLog = [];
        return log;
    }
};
EventBus.handlers = {};
EventBus = EventBus_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [persistence_1.default])
], EventBus);
exports.default = EventBus;
//# sourceMappingURL=event-bus.js.map