const { ObjectId } = require('mongodb');
const { connect } = require('./connect');

const add = async (name, ingredients, preparation, id) => {
  const db = await connect();

  const userId = ObjectId(id);

  const { insertedId } = await db.collection('recipes').insertOne({
    name,
    ingredients,
    preparation,
    userId,
  });

  return { recipe: { name, ingredients, preparation, userId, _id: insertedId } };
};

const listAll = async () => {
  const db = await connect();

  const recipes = await db.collection('recipes').find({}).toArray();

  return recipes;
};

const findById = async (id) => {
  const db = await connect();

  const recipe = await db.collection('recipes').findOne(ObjectId(id));

  return recipe;
};

const updateById = async (id, name, ingredients, preparation) => {
  const db = await connect();

  const updated = await db.collection('recipes').findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { name, ingredients, preparation } },
    { returnOriginal: false },
  );

  return updated.value;
};

const removeById = async (id) => {
  const db = await connect();
  return db.collection('recipes').deleteOne({ _id: ObjectId(id) });
};

const updateImageById = async (id, image) => {
  const db = await connect();

  const updated = await db.collection('recipes').findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { image } },
    { returnOriginal: false },
  );

  return updated.value;
};

module.exports = {
  add,
  listAll,
  findById,
  updateById,
  removeById,
  updateImageById,
};
