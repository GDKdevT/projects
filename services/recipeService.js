const { ObjectId } = require('mongodb');
const recipeModel = require('../models/recipeModel');

const verifyFields = (name, ingredients, preparation) => {
  if (!name || !ingredients || !preparation) {
    return { status: 400, message: 'Invalid entries. Try again.' };
  }
  return null;
};

const verifyUser = async (uId, id, role) => {
  const { userId } = await recipeModel.findById(id);
  if (ObjectId(userId).toString() !== ObjectId(uId).toString() && role !== 'admin') {
    return { status: 401, message: 'You do not own this recipe.' };
  }
  return null;
};

const add = async (name, ingredients, preparation, id) => {
  const verify = verifyFields(name, ingredients, preparation);

  if (verify) return verify;

  return recipeModel.add(name, ingredients, preparation, id);
};

const findRecipe = async (id) => {
  if (!ObjectId.isValid(id)) {
    return { status: 404, message: 'recipe not found' };
  }

  const recipe = await recipeModel.findById(id);

  if (!recipe) {
    return { status: 404, message: 'recipe not found' };
  }

  return recipe;
};

const updateRecipe = async (currentUserId, id, name, ingredients, preparation, role) => {
  const validation = await verifyUser(currentUserId, id, role);

  if (validation) return validation;

  return recipeModel.updateById(id, name, ingredients, preparation);
};

const remove = async (usrId, id, role) => {
  const error = await verifyUser(usrId, id, role);

  if (error) return error;

  return recipeModel.removeById(id);
};

const updateImage = async (usrId, id, role, image) => {
  const authentication = await verifyUser(usrId, id, role);

  if (authentication) return authentication;

  return recipeModel.updateImageById(id, `localhost:3000/images/${image}`);
};

module.exports = {
  add,
  findRecipe,
  updateRecipe,
  remove,
  updateImage,
};
