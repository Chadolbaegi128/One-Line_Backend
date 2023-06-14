const { userService, postService } = require("../service");
const util = require("../misc/util");

const adminController = {
  // 회원가입
  async getUserList(req, res, next) {
    // 현재 페이지 번호
    const page = Number(req.query.page ?? 1);
    // 페이지 당 불러올 회원 수
    const perPage = Number(req.query.perPage ?? 10);

    const { users, total, totalPage } = await userService.getAllUsers(
      page,
      perPage
    );
    res.json(
      util.buildResponse({
        page: page,
        perPage: perPage,
        totalPage: totalPage,
        userCount: total,
        users: users,
      })
    );
  },

  // 사용자 정보 수정
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { admin } = req.body;
      const user = await userService.updateUser(id, { admin });
      res.json(util.buildResponse(user));
    } catch (error) {
      next(error);
    }
  },

  // 사용자 정보 삭제 (회원 탈퇴)
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUser(id);
      res.json(`${user.nickname}님의 탈퇴가 완료되었습니다.`);
    } catch (error) {
      next(error);
    }
  },

  async getPostList(req, res, next) {
    try {
      // 현재 페이지 번호
      const page = Number(req.query.page ?? 1);
      // 페이지 당 불러올 회원 수
      const perPage = Number(req.query.perPage ?? 10);

      const { sanitzedPosts, total, totalPage } = await postService.getAllPosts(
        page,
        perPage
      );
      res.json(
        util.buildResponse({
          page: page,
          perPage: perPage,
          totalPage: totalPage,
          postsCount: total,
          posts: sanitzedPosts,
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
