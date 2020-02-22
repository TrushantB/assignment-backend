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
const api_controller_1 = require("@framework/interfaces/api-controller");
const extended_api_controller_1 = require("@framework/decorators/extended-api-controller");
const inject_repository_1 = require("@framework/decorators/inject-repository");
const extended_api_action_1 = require("@framework/decorators/extended-api-action");
const message_repository_1 = require("@interfaces/repositories/message-repository");
const { ObjectId } = require('mongodb');
const db_1 = require("@framework/database/db");
let PostsController = class PostsController extends api_controller_1.default {
    getMessagesAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyObject = {
                /*
                  TODO: Fill this array with messages, using IMessageRepository.
                */
                data: []
                // data: [{
                //   '_id': 'string',
                //   'message': 'message',
                //   'author': {
                //     '_id': 'string',
                //     'name': 'string',
                //     'is-admin': false
                //   }
                //   ,
                //   'replies': [],
                //   'created': 1
                // }],
            };
            try {
                // specify the DB's name
                const db = db_1.getDb();
                this.response.setStatusCode(200);
                this.Response.setBody({
                    data: {
                        results: yield db.collection('posts').find({}).toArray()
                    },
                });
                // close connection
                //client.close();
            }
            catch (err) {
                //console.log(`error while getMessage ${err}`);
                this.Response.setStatusCode(500);
                this.Response.setBody({
                    success: false,
                    data: {
                        message: `Error: ${err.message}`,
                    },
                });
            }
        });
    }
    postMessageAction(message, name, id, isAdmin, created) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(message);
                this.Response.setStatusCode(201);
                this.Response.setBody({
                    data: {
                        message: message,
                        results: db_1.getDb().collection('posts').insertOne({
                            author: { _id: id, name: name, 'is-admin': isAdmin },
                            message: message,
                            created: created,
                            replies: []
                        }),
                    },
                });
            }
            catch (err) {
                this.Response.setStatusCode(500);
                this.Response.setBody({
                    success: false,
                    data: {
                        message: `Error: ${err.message}`,
                    },
                });
            }
        });
    }
    //                       Explanation of the @ExtApiAction compound decorator
    putReplyAction(id, reply, name, userId, isAdmin, created) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = null;
                const replyMessage = null;
                /*
                  TODO: Add reply to message with given id and update database.
                */
                var ObjectID = require('mongodb').ObjectID;
                this.response.setBody({
                    success: true,
                    data: {
                        message: `Reply added to post ${id}`,
                        results: db_1.getDb().collection('posts').update({ "_id": ObjectID(id) }, { $push: { "replies": {
                                    _id: new ObjectID(),
                                    author: { userId: userId, name: name, 'is-admin': isAdmin },
                                    message: reply,
                                    created: created,
                                } } })
                    },
                    links: {
                        self: `/api/posts/${id}`,
                        message: reply
                    },
                });
            }
            catch (error) {
                this.response.setStatusCode(400);
                this.response.setBody({
                    success: false,
                    data: {
                        message: `Post ${id} not found.`,
                    },
                });
            }
        });
    }
    deleteMessageAction(id, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!replyId) {
                    console.log("delete action called");
                    db_1.getDb().collection('posts').remove({ '_id': ObjectId(id) });
                }
                else {
                    console.log("replay action called");
                    db_1.getDb().collection('posts').update({ '_id': ObjectId(id) }, { $pull: { "replies": { '_id': ObjectId(replyId) } } });
                }
            }
            catch (err) {
                this.Response.setStatusCode(500);
                this.Response.setBody({
                    success: false,
                    data: {
                        message: `Error: ${err.message}`,
                    },
                });
            }
        });
    }
};
__decorate([
    inject_repository_1.default('MessageRepository'),
    __metadata("design:type", message_repository_1.default)
], PostsController.prototype, "messages", void 0);
__decorate([
    extended_api_action_1.default('get', '/', [], 'messages.read', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getMessagesAction", null);
__decorate([
    extended_api_action_1.default('post', '/', ['message', 'name', 'id', 'isAdmin', 'created'], 'messages.write', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "postMessageAction", null);
__decorate([
    extended_api_action_1.default(
    //                     This is the HTTP method used for this action.
    'put', 
    /*                     This is the endpoint used to reach this action.
                           It combines with the controller module and API root, in this case /posts/:id
                           The : in front of id suggests this is a variable.
    */
    '/:id', 
    /*                     This array lists the names of the arguments for the action,
                           in the order they appear in the argument list.
    */
    [
        'id',
        'reply',
        'name',
        'userId',
        'isAdmin',
        'created',
    ], 
    /*                     This is the permissions required for this endpoint. Path variables can be used here,
                           in which case the name is substituted for the parameter.
    */
    'messages.write', 
    /*                     True if endpoint requires authentication.
                           Required for permissions, since permissions are stored in JWT.
    */
    true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "putReplyAction", null);
__decorate([
    extended_api_action_1.default('delete', '/:id', ['id', 'replyId'], 'messages.delete', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deleteMessageAction", null);
PostsController = __decorate([
    extended_api_controller_1.default('posts')
], PostsController);
exports.default = PostsController;
//# sourceMappingURL=posts.js.map