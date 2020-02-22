Object.defineProperty(exports, "__esModule", { value: true });
const { MongoClient } = require('mongodb');
const config_js_1 = require("./config.js");
// MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (err:any, client:[]) => {
//   if (err) {
//     process.stderr.write(`Error when connecting to database: ${err.message}\n`);
//     return;
//   }
//   const db = client.db('ratt_spar');
//   const metadata = await db.collection('migrations').findOne({ type: 'metadata' });
// });
let _db;
// module.exports = {
//     getDb,
//     initDb
// };
function initDb(callback) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null, _db);
    }
    MongoClient.connect(config_js_1.default.db.connectionString, config_js_1.default.db.connectionOptions, connected);
    function connected(err, db) {
        if (err) {
            process.stderr.write(`Error when connecting to database: ${err.message}\n`);
            return callback(err);
        }
        console.log("DB initialized - connected to: " + config_js_1.default.db.connectionString.split("@")[1]);
        _db = db.db('ratt_spar');
        return callback(null, _db);
    }
}
exports.initDb = initDb;
function getDb() {
    console.log(_db, "Db has not been initialized. Please called init first.");
    return _db;
}
exports.getDb = getDb;
//# sourceMappingURL=db.js.map