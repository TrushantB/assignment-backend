Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const ddd_1 = require("@framework/ddd");
const author_1 = require("./author");
class Message extends ddd_1.AggregateRoot {
    /* TODO: Fill out methods. */
    getMessage() {
        return this.message;
    }
    getAuthor() {
        return this.author;
    }
    getReplies() {
        return this.replies;
    }
    removeReply(index) {
    }
    addReply(reply) {
    }
    getReplyCount() {
        return null;
    }
    toObject() {
        return {
            _id: this.Identifier.toString(),
            message: this.message,
            author: this.author.toObject(),
            replies: this.replies.map((reply) => {
                return reply.toObject();
            }),
            created: this.created.getTime(),
        };
    }
    static createMessage(message) {
        const ret = new Message(message._id);
        ret.message = message.message;
        ret.replies = (util_1.isUndefined(message.replies))
            ? []
            : message.replies.map((reply) => {
                return Message.createMessage(reply);
            });
        ret.created = new Date(message.created);
        ret.author = author_1.default.createAuthor(message.author);
        return ret;
    }
}
exports.default = Message;
//# sourceMappingURL=message.js.map