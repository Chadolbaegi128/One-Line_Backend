const { Post, Category, User, Comment } = require("./models");
const util = require("../misc/util");

const categoryDAO = {
  // 카테고리 작성
  async create(categoryDTO) {
    const createdCategory = await Category.create(categoryDTO);
    return createdCategory;
  },

  // 카테고리 조회
  async findAllBy(filter) {
    const sanitizedFilter = util.sanitizeObject(filter);

    const categories = await Category.findAll({
      where: sanitizedFilter,
    });

    return categories;
  },

  // 카테고리 수정
  async updateOne(categoryDto, filter) {
    const sanitizedToUpdate = util.sanitizeObject(filter);

    const updatedCategory = await Category.update(categoryDto, {
      where: sanitizedToUpdate,
    });

    return updatedCategory;
  },

  // 카테고리 삭제
  async deleteOne(filter) {
    const sanitizedToUpdate = util.sanitizeObject(filter);
    const deletedCategory = await Category.destroy({
      where: sanitizedToUpdate,
    });

    return deletedCategory;
  },
};

module.exports = categoryDAO;
