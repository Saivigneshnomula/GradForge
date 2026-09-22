const CommunityPost = require("../models/CommunityPost");

/* =========================================================
   CREATE POST
========================================================= */

const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        message: "Title, content and category are required",
      });
    }

    const post = await CommunityPost.create({
      author: req.userId,
      title,
      content,
      category,
      tags: tags || [],
    });

    const populatedPost =
      await CommunityPost.findById(post._id)
        .populate("author", "name");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
};


/* =========================================================
   GET ALL POSTS
========================================================= */

const getPosts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {
      isApproved: true,
    };

    if (category) {
      filter.category = category;
    }

    const posts = await CommunityPost.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
};


/* =========================================================
   GET SINGLE POST
========================================================= */

const getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isApproved: true,
    }).populate("author", "name");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch post",
    });
  }
};


/* =========================================================
   UPVOTE POST
========================================================= */

const upvotePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.userId.toString();

    const alreadyUpvoted = post.upvotes.some(
      (id) => id.toString() === userId
    );

    if (alreadyUpvoted) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.upvotes.push(req.userId);
    }

    await post.save();

    res.json({
      message: alreadyUpvoted
        ? "Upvote removed"
        : "Post upvoted",

      upvotes: post.upvotes.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update upvote",
    });
  }
};


/* =========================================================
   DELETE OWN POST
========================================================= */

const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};


module.exports = {
  createPost,
  getPosts,
  getPost,
  upvotePost,
  deletePost,
};