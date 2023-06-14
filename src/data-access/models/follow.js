const Sequelize = require("sequelize");

module.exports = class Follow extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Follow",
        tableName: "follows",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    // Follow 관계는 User 모델과 두 번 연관되므로 이 부분은 User 모델에서 처리해주기로 하였습니다.
  }
};
