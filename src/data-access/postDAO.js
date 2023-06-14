const { Post, Category, User, Comment } = require("./models");
const db = require('./models')
const util = require("../misc/util");

const postDAO = {
  // 게시글 작성
  async create(postDTO) {
    const createdPost = await Post.create(postDTO,{
      attributes: ["id"]
    });
    return createdPost;
  },

  // 게시글 상세 조회
  async findOne(filter) {
    const sanitizedFilter = util.sanitizeObject(filter);

    const post = await Post.findOne({
      where: sanitizedFilter,
      attributes: ["id","title","content","summary","views","createdAt"],
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["nickname"],
        },
        {
          model: User,
          through: { attributes: [] }, 
          as: "Likers", 
          attributes: ["nickname"],
        },
        {
          model: Comment,
          attributes: ["id", "content", "createdAt"],
          include: {
            model: User,
            attributes: ["nickname"],
          },
        },
      ],
    });
    
    return post;
  },

  async findAllPosts(page, perPage) {
    const [total, posts] = await Promise.all([
      Post.count(),
      Post.findAll({
        order: [["createdAt", "DESC"]],
        offset: perPage * (page - 1),
        limit: perPage,
      }),
    ]);
    const totalPage = Math.ceil(total / perPage);
    return { posts, total, totalPage };
  },

  // 게시글 조건 조회
  async findAllBy(filter) {
    const sanitizedFilter = util.sanitizeObject(filter);

    const posts = await Post.findAll({
      where: sanitizedFilter,
      attributes: ["id","title","content","summary","views","createdAt"],
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
        {
          model: User,
          through: { attributes: [] }, 
          as: "Likers", 
          attributes: ["nickname"],
        },
      ],
    });

    return posts;
  },

  // 게시글 전체 조회(최신 순)
  async findAll(pageNo) {
    let offset = 0; // 조회를 시작할 기준점 = 클릭하는 페이지 넘버
    if (pageNo > 1) {
      offset = (pageNo - 1) * 4;
    }
    const posts = await Post.findAndCountAll({
      attributes: ["id","title","content","summary","views","createdAt"],
      limit: 4, // 몇 개의 데이터를 보여줄지 결정(불변)
      offset: offset,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
        {
          model: User,
          through: { attributes: [] }, 
          as: "Likers", 
          attributes: ["nickname"],
        },
      ],
    });

    return posts;
  },

  // 게시글 trending 조회
  async findAllByTrending(pageNo) {
    let offset = 0; // 조회를 시작할 기준점 = 클릭하는 페이지 넘버
    if (pageNo > 1) {
      offset = (pageNo - 1) * 4;
    }
    const posts = await Post.findAndCountAll({
      attributes: ["id","title","content","summary","views","createdAt"],
      limit: 4, // 몇 개의 데이터를 보여줄지 결정(불변)
      offset: offset,
      order: [["views", "desc"]],
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
        {
          model: User,
          through: { attributes: [] }, 
          as: "Likers", 
          attributes: ["nickname"],
        },
      ],
    });

    return posts;
  },

  // 게시글 수정
  async updateOne(postDTO, filter) {
    const sanitizedToUpdate = util.sanitizeObject(filter);

    const updatedPost = await Post.update(postDTO, {
      where: sanitizedToUpdate,
    });

    return updatedPost;
  },

  // 게시글 삭제
  async deleteOne(filter) {
    const sanitizedToUpdate = util.sanitizeObject(filter);

    const deletedPost = await Post.destroy({
      where: sanitizedToUpdate,
    });
    
    return deletedPost;
  },
};

module.exports = postDAO;
