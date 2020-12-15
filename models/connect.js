const { MongoClient } = require('mongodb');

const connect = async () => MongoClient.connect('mongodb://localhost:27017/Cookmaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db('Cookmaster'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = {
  connect,
};
