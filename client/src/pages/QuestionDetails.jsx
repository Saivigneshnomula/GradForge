import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [answersOpen, setAnswersOpen] =
    useState(false);

  const [answerText, setAnswerText] =
    useState("");

  const [replyingTo, setReplyingTo] =
    useState(null);

  const [replyText, setReplyText] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editText, setEditText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [answerLoading, setAnswerLoading] =
    useState(false);

  const [replyLoading, setReplyLoading] =
    useState(false);

  const [editLoading, setEditLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     LOAD DATA
  ========================= */
  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const questionResponse =
        await api.get(
          `/questions/${id}`
        );

      setQuestion(
        questionResponse.data.question
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load question."
      );

      setLoading(false);
      return;
    }

    try {
      const answersResponse =
        await api.get(
          `/questions/${id}/answers`
        );

      setAnswers(
        answersResponse.data.answers || []
      );
    } catch (error) {
      console.error(error);
      setAnswers([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* =========================
     OPEN ANSWERS
  ========================= */
  const openAnswers = () => {
    setAnswersOpen(true);

    setTimeout(() => {
      document
        .getElementById("answers")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =========================
     QUESTION UPVOTE
  ========================= */
  const handleQuestionUpvote =
    async () => {
      try {
        const response =
          await api.post(
            `/questions/${id}/upvote`
          );

        setQuestion((prev) => ({
          ...prev,
          upvotes: Array(
            response.data.upvotes
          ).fill(null),
        }));
      } catch (error) {
        console.error(error);
      }
    };

  /* =========================
     ADD ANSWER
  ========================= */
  const handleAnswerSubmit =
    async (e) => {
      e.preventDefault();

      if (!answerText.trim()) return;

      try {
        setAnswerLoading(true);

        const response =
          await api.post(
            `/questions/${id}/answers`,
            {
              content:
                answerText.trim(),
            }
          );

        setAnswers((prev) => [
          ...prev,
          response.data.answer,
        ]);

        setQuestion((prev) => ({
          ...prev,
          answersCount:
            (prev.answersCount || 0) +
            1,
        }));

        setAnswerText("");
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Failed to create answer."
        );
      } finally {
        setAnswerLoading(false);
      }
    };

  /* =========================
     START REPLY
  ========================= */
  const handleReplyClick = (
    answer
  ) => {
    const name =
      answer.author?.name ||
      "User";

    setEditingId(null);

    setReplyingTo(answer._id);

    setReplyText(`@${name} `);
  };

  /* =========================
     CANCEL REPLY
  ========================= */
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  /* =========================
     ADD REPLY
  ========================= */
  const handleReplySubmit =
    async (
      e,
      parentAnswerId
    ) => {
      e.preventDefault();

      if (!replyText.trim()) return;

      try {
        setReplyLoading(true);

        const response =
          await api.post(
            `/questions/${id}/answers`,
            {
              content:
                replyText.trim(),
              parentAnswer:
                parentAnswerId,
            }
          );

        setAnswers((prev) => [
          ...prev,
          response.data.answer,
        ]);

        setQuestion((prev) => ({
          ...prev,
          answersCount:
            (prev.answersCount || 0) +
            1,
        }));

        setReplyText("");
        setReplyingTo(null);
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Failed to create reply."
        );
      } finally {
        setReplyLoading(false);
      }
    };

  /* =========================
     START EDIT
  ========================= */
  const startEdit = (answer) => {
    setReplyingTo(null);

    setEditingId(answer._id);
    setEditText(answer.content);
  };

  /* =========================
     CANCEL EDIT
  ========================= */
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  /* =========================
     SAVE EDIT
  ========================= */
  const handleEditSubmit =
    async (
      e,
      answerId
    ) => {
      e.preventDefault();

      if (!editText.trim()) return;

      try {
        setEditLoading(true);

        const response =
          await api.put(
            `/questions/answers/${answerId}`,
            {
              content:
                editText.trim(),
            }
          );

        setAnswers((prev) =>
          prev.map((answer) =>
            answer._id === answerId
              ? response.data.answer
              : answer
          )
        );

        cancelEdit();
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Failed to edit answer."
        );
      } finally {
        setEditLoading(false);
      }
    };

  /* =========================
     DELETE ANSWER BRANCH
  ========================= */
  const handleDeleteAnswer =
    async (answerId) => {
      const confirmed =
        window.confirm(
          "Delete this answer and all replies under it?"
        );

      if (!confirmed) return;

      try {
        const response =
          await api.delete(
            `/questions/answers/${answerId}`
          );

        const deletedIds =
          response.data.deletedIds ||
          [answerId];

        setAnswers((prev) =>
          prev.filter(
            (answer) =>
              !deletedIds.includes(
                answer._id
              )
          )
        );

        setQuestion((prev) => ({
          ...prev,
          answersCount: Math.max(
            0,
            (prev.answersCount || 0) -
              (response.data.deletedCount ||
                1)
          ),
        }));

        setReplyingTo(null);
        setEditingId(null);
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Failed to delete answer."
        );
      }
    };

  /* =========================
     UPVOTE ANSWER
  ========================= */
  const handleAnswerUpvote =
    async (answerId) => {
      try {
        const response =
          await api.post(
            `/questions/answers/${answerId}/upvote`
          );

        setAnswers((prev) =>
          prev.map((answer) =>
            answer._id === answerId
              ? {
                  ...answer,
                  upvotes: Array(
                    response.data.upvotes
                  ).fill(null),
                }
              : answer
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  /* =========================
     ENTER TO SUBMIT
  ========================= */
  const handleEnterSubmit = (
    e,
    submitFunction
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      submitFunction(e);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading question...
        </p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */
  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">

          <p className="text-red-500 mb-4">
            {error ||
              "Question not found."}
          </p>

          <button
            onClick={() =>
              navigate("/ask-solve")
            }
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl"
          >
            Back to Ask & Solve
          </button>

        </div>
      </div>
    );
  }

  const questionAuthor =
    question.author?.name ||
    "Unknown User";

  /* =========================
     TOP LEVEL ANSWERS
  ========================= */
  const topLevelAnswers =
    answers.filter(
      (answer) =>
        !answer.parentAnswer
    );

  /* =========================
     GET REPLIES
  ========================= */
  const getReplies = (
    answerId
  ) => {
    return answers.filter(
      (answer) =>
        answer.parentAnswer ===
          answerId ||
        answer.parentAnswer?._id ===
          answerId
    );
  };

  /* =========================
     ANSWER COMPONENT
  ========================= */
  const AnswerItem = ({
    answer,
    level = 0,
  }) => {
    const answerAuthor =
      answer.author?.name ||
      "Unknown User";

    const isOwnAnswer =
      user?._id &&
      answer.author?._id &&
      user._id ===
        answer.author._id;

    const replies =
      getReplies(answer._id);

    const isEditing =
      editingId === answer._id;

    const isReplying =
      replyingTo === answer._id;

    return (
      <div
        className={
          level === 0
            ? "pt-5"
            : "ml-7 mt-4 relative"
        }
      >

        {/* Reply branch */}
        {level > 0 && (
          <>
            <div className="absolute -left-5 top-0 bottom-0 border-l border-slate-200" />

            <div className="absolute -left-5 top-5 w-4 border-t border-slate-200" />
          </>
        )}

        {/* Answer */}
        <div className="flex gap-3">

          {/* Avatar */}
          <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
            {answerAuthor
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">

            {/* Name + date */}
            <div className="flex items-center gap-2">

              <span className="font-semibold text-slate-900 text-sm">
                {answerAuthor}
              </span>

              <span className="text-xs text-slate-400">
                {new Date(
                  answer.createdAt
                ).toLocaleDateString()}
              </span>

            </div>

            {/* =========================
                EDIT BOX
            ========================= */}
            {isEditing ? (

              <form
                onSubmit={(e) =>
                  handleEditSubmit(
                    e,
                    answer._id
                  )
                }
                className="mt-2"
              >

                <textarea
                  value={editText}
                  onChange={(e) =>
                    setEditText(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleEnterSubmit(
                      e,
                      () =>
                        handleEditSubmit(
                          e,
                          answer._id
                        )
                    )
                  }
                  className="input min-h-[90px] resize-y"
                  autoFocus
                />

                <div className="flex gap-2 mt-2">

                  <button
                    type="submit"
                    disabled={
                      editLoading ||
                      !editText.trim()
                    }
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {editLoading
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-sm text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <>
                {/* Content */}
                <p className="text-sm text-slate-700 leading-6 mt-1 whitespace-pre-wrap">
                  {answer.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-1.5">

                  <button
                    onClick={() =>
                      handleAnswerUpvote(
                        answer._id
                      )
                    }
                    className="text-xs font-semibold text-slate-400 hover:text-indigo-600"
                  >
                    {answer.upvotes
                      ?.length || 0}{" "}
                    likes
                  </button>

                  <button
                    onClick={() =>
                      handleReplyClick(
                        answer
                      )
                    }
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600"
                  >
                    Reply
                  </button>

                  {isOwnAnswer && (
                    <>
                      <button
                        onClick={() =>
                          startEdit(
                            answer
                          )
                        }
                        className="text-xs font-semibold text-slate-400 hover:text-slate-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteAnswer(
                            answer._id
                          )
                        }
                        className="text-xs font-semibold text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}

                </div>
              </>
            )}

            {/* =========================
                REPLY BOX
            ========================= */}
            {isReplying && (
              <form
                onSubmit={(e) =>
                  handleReplySubmit(
                    e,
                    answer._id
                  )
                }
                className="mt-3"
              >

                <div className="flex gap-2">
<textarea
  value={replyText}
  onChange={(e) => setReplyText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (replyText.trim()) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  }}
  placeholder={`Reply to ${answerAuthor}...`}
  className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none bg-slate-50"
  rows={1}
  autoFocus
/>
                  
                  <button
                    type="submit"
                    disabled={
                      replyLoading ||
                      !replyText.trim()
                    }
                    className="self-end px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40"
                  >
                    {replyLoading
                      ? "..."
                      : "Reply"}
                  </button>

                </div>

                <div className="flex gap-3 mt-1 ml-2">

                  <button
                    type="button"
                    onClick={cancelReply}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>

                  <span className="text-xs text-slate-300">
                    Enter to reply • Shift + Enter for new line
                  </span>

                </div>

              </form>
            )}

          </div>

        </div>

        {/* =========================
            NESTED REPLIES
        ========================= */}
        {replies.length > 0 && (
          <div>
            {replies.map(
              (reply) => (
                <AnswerItem
                  key={reply._id}
                  answer={reply}
                  level={
                    level + 1
                  }
                />
              )
            )}
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() =>
            navigate("/ask-solve")
          }
          className="text-sm text-slate-500 hover:text-indigo-600 mb-6"
        >
          ← Back to Ask & Solve
        </button>

        {/* =========================
            QUESTION
        ========================= */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <div className="mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              {question.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {question.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mt-5">

            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {questionAuthor
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <p className="font-semibold text-slate-800">
                {questionAuthor}
              </p>

              <p className="text-xs text-slate-400">
                Asked{" "}
                {new Date(
                  question.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

          {/* Description */}
          <div className="mt-7 text-slate-700 leading-7 whitespace-pre-wrap">
            {question.description}
          </div>

          {/* Tags */}
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-7">

              {question.tags.map(
                (tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-sm"
                  >
                    #{tag}
                  </span>
                )
              )}

            </div>
          )}

          {/* Actions */}
          <div className="border-t border-slate-200 mt-8 pt-5 flex flex-wrap items-center gap-3">

            <button
              onClick={
                handleQuestionUpvote
              }
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold transition text-sm"
            >
              ▲{" "}
              {question.upvotes
                ?.length || 0}{" "}
              Votes
            </button>

            <button
              onClick={openAnswers}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold transition text-sm"
            >
              💬{" "}
              {question.answersCount ||
                0}{" "}
              Answers
            </button>

            <span className="px-2 text-sm text-slate-400">
              👁 {question.views || 0}
            </span>

          </div>

        </article>

        {/* =========================
            ANSWERS
        ========================= */}
        {answersOpen && (
          <section
            id="answers"
            className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 scroll-mt-6"
          >

            {/* Header */}
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-slate-900">
                Answers
                <span className="font-normal text-slate-400 ml-2">
                  {answers.length}
                </span>
              </h2>

              <button
                onClick={() =>
                  setAnswersOpen(false)
                }
                className="text-sm text-slate-400 hover:text-slate-700"
              >
                Close
              </button>

            </div>

            {/* =========================
                MAIN ANSWER INPUT
            ========================= */}
            <form
              onSubmit={
                handleAnswerSubmit
              }
              className="mt-5"
            >

             <textarea
  value={answerText}
  onChange={(e) => setAnswerText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (answerText.trim()) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  }}
  placeholder="Write an answer..."
  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none"
  rows={3}
  maxLength={5000}
/> 
              <div className="flex justify-between items-center mt-2">

                <span className="text-xs text-slate-300">
                  Enter to post • Shift + Enter for new line
                </span>

                <button
                  type="submit"
                  disabled={
                    answerLoading ||
                    !answerText.trim()
                  }
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40"
                >
                  {answerLoading
                    ? "Posting..."
                    : "Post"}
                </button>

              </div>

            </form>

            {/* =========================
                ANSWERS
            ========================= */}
            <div className="mt-4">

              {topLevelAnswers.length ===
              0 ? (

                <div className="text-center py-10 text-slate-400">
                  <div className="text-3xl mb-2">
                    💬
                  </div>

                  <p>
                    No answers yet.
                  </p>

                  <p className="text-sm mt-1">
                    Be the first to help!
                  </p>
                </div>

              ) : (

                <div>

                  {topLevelAnswers.map(
                    (answer) => (
                      <AnswerItem
                        key={answer._id}
                        answer={answer}
                      />
                    )
                  )}

                </div>

              )}

            </div>

          </section>
        )}

      </div>

      {/* Scroll button */}
      <button
        onClick={() =>
          window.scrollBy({
            top:
              window.innerHeight *
              0.8,
            behavior: "smooth",
          })
        }
        className="fixed right-5 bottom-6 w-11 h-11 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition z-50"
        aria-label="Scroll down"
      >
        ↓
      </button>

    </div>
  );
};

export default QuestionDetails;