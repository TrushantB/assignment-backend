// Migration file for collection review

module.exports.migrate = async function migrate(db) {
  const collection = db.collection('review');
};

module.exports.rollback = async function rollback(db) {
  const collection = db.collection('review');
};
