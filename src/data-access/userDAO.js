const { User, Post, Category } = require("./models");
const util = require("../misc/util");

const userDAO = {
  // 회원가입
  async create({ id, email, blogName, nickname, bio }) {
    const user = await User.create({
      id,
      email,
      blogName,
      nickname,
      bio,
    });
    return user;
  },

  // 단일 사용자 조회
  async findOne(filter) {
    const sanitizedFilter = util.sanitizeObject({
      id: filter.id,
      email: filter.email,
      blogName: filter.blogName,
      nickname: filter.nickname,
      bio: filter.bio,
    });

    const user = await User.findOne({ where: sanitizedFilter });
    return user;
  },

  // 마이페이지에서 본인 정보 조회
  async findMyDetail(filter) {
    const sanitizedFilter = util.sanitizeObject({
      id: filter.id,
      email: filter.email,
      blogName: filter.blogName,
      nickname: filter.nickname,
      bio: filter.bio,
    });

    const user = await User.findOne({
      where: sanitizedFilter,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Post,
          attributes: [
            "id",
            "title",
            "content",
            "summary",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });
    return user;
  },

  // 타 유저 페이지 조회
  async findOneDetail(filter) {
    const sanitizedFilter = util.sanitizeObject({
      id: filter.id,
      email: filter.email,
      blogName: filter.blogName,
      nickname: filter.nickname,
      bio: filter.bio,
    });

    const user = await User.findOne({
      where: sanitizedFilter,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Post,
          attributes: [
            "id",
            "title",
            "content",
            "summary",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });
    return user;
  },

  // user를 팔로우 하는 users
  async findFollowers(id) {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "Followers",
          attributes: ["id", "nickname"], // 반환하고자 하는 필드를 설정하세요.
        },
      ],
    });
    return user ? user.Followers : null;
  },

  // user가 팔로우 하는 users
  async findFollowings(id) {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "Followings",
          attributes: ["id", "nickname"],
        },
      ],
    });
    return user ? user.Followings : null;
  },

  // 팔로우 추가
  async addFollowing(userId, followingId) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new Error("회원을 찾을 수 없습니다.");
    await user.addFollowings(followingId);
    return { userId, followingId };
  },

  // 팔로우 취소
  async deleteFollowing(userId, followingId) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new Error("회원을 찾을 수 없습니다.");
    await user.removeFollowings(followingId);
    return { userId, followingId };
  },

  // 모든 사용자 조회
  async findAll(page, perPage) {
    const [total, users] = await Promise.all([
      User.countDocuments({}),
      User.find()
        .lean()
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage),
    ]);
    const totalPage = Math.ceil(total / perPage);
    return { users, total, totalPage };
  },

  // 사용자 정보 수정
  async updateOne(id, toUpdate) {
    const sanitizedToUpdate = util.sanitizeObject({
      blogName: toUpdate.blogName,
      nickname: toUpdate.nickname,
      bio: toUpdate.bio,
    });

    const [, updatedUsers] = await User.update(sanitizedToUpdate, {
      where: { id },
      returning: true,
    });
    const updatedUser = updatedUsers[0];
    return updatedUser;
  },

  // 사용자 정보 삭제
  async deleteOne(id) {
    const user = await User.findOne({ where: { id } });
    await User.destroy({ where: { id } });
    return user;
  },
};

module.exports = userDAO;
