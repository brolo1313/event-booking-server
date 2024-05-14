const Result = require("./result");

async function findById(id, schema) {
  try {
    const data = await schema.findById(id);
    return Result.Success(data);
  } catch (error) {
    return Result.Fail(error);
  }
}

async function deleteById(id, schema) {
  try {
    const data = await schema.findByIdAndDelete(id);
    return Result.Success(data);
  } catch (error) {
    return Result.Fail(error);
  }
}

async function save(data) {
  try {
    const result = await data.save();
    return Result.Success(result);
  } catch (error) {
    return Result.Fail(error);
  }
}

module.exports = {
  findById,
  deleteById,
  save,
};
