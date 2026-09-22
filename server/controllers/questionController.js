const Question = require("../models/Question");
const Answer = require("../models/Answer");

/* =========================
   CREATE QUESTION
========================= */
const createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message:
          "Title, description and category are required",
      });
    }

    const question = await Question.create({
      author: req.userId,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags || [],
    });

    const populatedQuestion =
      await Question.findById(question._id).populate(
        "author",
        "name"
      );

    res.status(201).json({
      message: "Question created successfully",
      question: populatedQuestion,
    });
  } catch (error) {
    console.error("CREATE QUESTION ERROR:", error);

    res.status(500).json({
      message: "Failed to create question",
    });
  }
};

/* =========================
   GET ALL QUESTIONS
========================= */
const getQuestions = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {
      isApproved: true,
    };

    if (category) {
      filter.category = category;
    }

    const questions = await Question.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("GET QUESTIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
};

/* =========================
   GET SINGLE QUESTION
========================= */
const getQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const updatedQuestion =
      await Question.findOneAndUpdate(
        {
          _id: questionId,
          isApproved: true,
          viewedBy: {
            $ne: req.userId,
          },
        },
        {
          $addToSet: {
            viewedBy: req.userId,
          },
          $inc: {
            views: 1,
          },
        },
        {
          new: true,
        }
      ).populate("author", "name");

    let question = updatedQuestion;

    if (!question) {
      question = await Question.findOne({
        _id: questionId,
        isApproved: true,
      }).populate("author", "name");
    }

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      question,
    });
  } catch (error) {
    console.error("GET QUESTION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch question",
    });
  }
};

/* =========================
   UPVOTE QUESTION
========================= */
const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const userId = req.userId.toString();

    const alreadyUpvoted = question.upvotes.some(
      (id) => id.toString() === userId
    );

    if (alreadyUpvoted) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      question.upvotes.push(req.userId);
    }

    await question.save();

    res.json({
      message: alreadyUpvoted
        ? "Upvote removed"
        : "Question upvoted",
      upvotes: question.upvotes.length,
    });
  } catch (error) {
    console.error("QUESTION UPVOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to update question upvote",
    });
  }
};

/* =========================
   CREATE ANSWER / REPLY
========================= */
const createAnswer = async (req, res) => {
  try {
    const {
      content,
      parentAnswer,
    } = req.body;

    const { questionId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Answer content is required",
      });
    }

    const question = await Question.findOne({
      _id: questionId,
      isApproved: true,
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (parentAnswer) {
      const parent = await Answer.findOne({
        _id: parentAnswer,
        question: questionId,
      });

      if (!parent) {
        return res.status(404).json({
          message: "Parent answer not found",
        });
      }
    }

    const answer = await Answer.create({
      question: questionId,
      author: req.userId,
      content: content.trim(),
      parentAnswer: parentAnswer || null,
    });

    question.answersCount += 1;

    await question.save();

    const populatedAnswer =
      await Answer.findById(answer._id).populate(
        "author",
        "name"
      );

    res.status(201).json({
      message: parentAnswer
        ? "Reply added successfully"
        : "Answer added successfully",
      answer: populatedAnswer,
    });
  } catch (error) {
    console.error("CREATE ANSWER ERROR:", error);

    res.status(500).json({
      message: "Failed to create answer",
    });
  }
};

/* =========================
   GET ANSWERS
========================= */
const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;

    const answers = await Answer.find({
      question: questionId,
    })
      .populate("author", "name")
      .sort({ createdAt: 1 });

    res.json({
      count: answers.length,
      answers,
    });
  } catch (error) {
    console.error("GET ANSWERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch answers",
    });
  }
};

/* =========================
   UPVOTE ANSWER
========================= */
const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(
      req.params.id
    );

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    const userId = req.userId.toString();

    const alreadyUpvoted = answer.upvotes.some(
      (id) => id.toString() === userId
    );

    if (alreadyUpvoted) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      answer.upvotes.push(req.userId);
    }

    await answer.save();

    res.json({
      message: alreadyUpvoted
        ? "Upvote removed"
        : "Answer upvoted",
      upvotes: answer.upvotes.length,
    });
  } catch (error) {
    console.error("ANSWER UPVOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to update answer upvote",
    });
  }
};

/* =========================
   EDIT OWN ANSWER
========================= */
const editAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Answer content is required",
      });
    }

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    if (
      answer.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own answers",
      });
    }

    answer.content = content.trim();

    await answer.save();

    const updatedAnswer =
      await Answer.findById(id).populate(
        "author",
        "name"
      );

    res.json({
      message: "Answer updated successfully",
      answer: updatedAnswer,
    });
  } catch (error) {
    console.error("EDIT ANSWER ERROR:", error);

    res.status(500).json({
      message: "Failed to edit answer",
    });
  }
};

/* =========================
   DELETE ANSWER + BRANCH
========================= */
const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    if (
      answer.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own answers",
      });
    }

    /*
      Get every answer in this question.
    */
    const allAnswers = await Answer.find({
      question: answer.question,
    }).select("_id parentAnswer");

    /*
      Build complete branch.
    */
    const idsToDelete = new Set([
      answerId.toString(),
    ]);

    let changed = true;

    while (changed) {
      changed = false;

      allAnswers.forEach((item) => {
        if (
          item.parentAnswer &&
          idsToDelete.has(
            item.parentAnswer.toString()
          ) &&
          !idsToDelete.has(
            item._id.toString()
          )
        ) {
          idsToDelete.add(
            item._id.toString()
          );

          changed = true;
        }
      });
    }

    const ids = Array.from(idsToDelete);

    await Answer.deleteMany({
      _id: {
        $in: ids,
      },
    });

    await Question.findByIdAndUpdate(
      answer.question,
      {
        $inc: {
          answersCount: -ids.length,
        },
      }
    );

    res.json({
      message:
        "Answer and its reply branch deleted successfully",
      deletedCount: ids.length,
      deletedIds: ids,
    });
  } catch (error) {
    console.error(
      "DELETE ANSWER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete answer",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  upvoteQuestion,
  createAnswer,
  getAnswers,
  upvoteAnswer,
  editAnswer,
  deleteAnswer,
};