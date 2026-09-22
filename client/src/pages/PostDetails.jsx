import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  // Main comment
  const [commentText, setCommentText] = useState("");

  // Reply
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Comments section
  const [commentsOpen, setCommentsOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     FETCH POST
  ========================= */
  const fetchPost = async () => {
    try {
      const response = await api.get(`/community/${id}`);
      setPost(response.data.post);
    } catch (error) {
      console.error(error);
      setError("Failed to load post.");
    }
  };

  /* =========================
     FETCH COMMENTS
  ========================= */
  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${id}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     LOAD DATA
  ========================= */
  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchPost(),
      fetchComments(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  /* =========================
     OPEN COMMENTS
  ========================= */
  const openComments = () => {
    setCommentsOpen(true);

    setTimeout(() => {
      document
        .getElementById("comments")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =========================
     UPVOTE
  ========================= */
  const handleUpvote = async () => {
    try {
      const response = await api.post(
        `/community/${id}/upvote`
      );

      setPost((prev) => ({
        ...prev,
        upvotes: Array(response.data.upvotes).fill(null),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     ADD COMMENT
  ========================= */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);

      const response = await api.post(`/comments/${id}`, {
        content: commentText.trim(),
      });

      setComments((prev) => [
        ...prev,
        response.data.comment,
      ]);

      setPost((prev) => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
      }));

      setCommentText("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  /* =========================
     START REPLY
  ========================= */
  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
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
  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    try {
      setReplyLoading(true);

      const response = await api.post(`/comments/${id}`, {
        content: replyText.trim(),
        parentComment: parentCommentId,
      });

      setComments((prev) => [
        ...prev,
        response.data.comment,
      ]);

      setPost((prev) => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
      }));

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add reply."
      );
    } finally {
      setReplyLoading(false);
    }
  };

  /* =========================
     DELETE COMMENT
  ========================= */
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Delete this comment and its replies?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(
        `/comments/${commentId}`
      );

      const deletedCount =
        response.data.deletedCount || 1;

      setComments((prev) => {
        const idsToDelete = new Set([commentId]);

        let changed = true;

        while (changed) {
          changed = false;

          prev.forEach((comment) => {
            if (
              comment.parentComment &&
              idsToDelete.has(
                comment.parentComment
              ) &&
              !idsToDelete.has(comment._id)
            ) {
              idsToDelete.add(comment._id);
              changed = true;
            }
          });
        }

        return prev.filter(
          (comment) =>
            !idsToDelete.has(comment._id)
        );
      });

      setPost((prev) => ({
        ...prev,
        commentsCount: Math.max(
          0,
          (prev.commentsCount || 0) -
            deletedCount
        ),
      }));

      if (replyingTo === commentId) {
        cancelReply();
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete comment."
      );
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading post...
        </p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */
  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-red-500 mb-4">
            {error || "Post not found."}
          </p>

          <button
            onClick={() => navigate("/community")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Back to Community
          </button>

        </div>
      </div>
    );
  }

  const authorName =
    post.author?.name || "Unknown User";

  // Normal top-level comments
  const topLevelComments = comments.filter(
    (comment) => !comment.parentComment
  );

  // Get replies for a comment
  const getReplies = (commentId) => {
    return comments.filter(
      (comment) =>
        comment.parentComment === commentId ||
        comment.parentComment?._id === commentId
    );
  };

  /* =========================
     COMMENT COMPONENT
  ========================= */
  const CommentItem = ({
    comment,
    level = 0,
  }) => {
    const commentAuthor =
      comment.author?.name || "Unknown User";

    const isOwnComment =
      user?._id &&
      comment.author?._id &&
      user._id === comment.author._id;

    const replies = getReplies(comment._id);

    return (
      <div
        className={
          level > 0
            ? "ml-8 mt-4"
            : "mt-5"
        }
      >

        <div className="relative">

          {/* Branch line for replies */}
          {level > 0 && (
            <>
              <div className="absolute -left-5 top-0 bottom-0 border-l-2 border-slate-200" />

              <div className="absolute -left-5 top-5 w-4 border-t-2 border-slate-200" />
            </>
          )}

          <div className="flex gap-3">

            {/* Avatar */}
            <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
              {commentAuthor
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">

              {/* Author */}
              <div className="flex flex-wrap items-center gap-2">

                <p className="font-semibold text-slate-800">
                  {commentAuthor}
                </p>

                <span className="text-xs text-slate-400">
                  {new Date(
                    comment.createdAt
                  ).toLocaleString()}
                </span>

              </div>

              {/* Content */}
              <p className="text-slate-600 mt-1 whitespace-pre-wrap leading-6">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-2">

                <button
                  onClick={() =>
                    handleReplyClick(
                      comment._id
                    )
                  }
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                >
                  ↩ Reply
                </button>

                {isOwnComment && (
                  <button
                    onClick={() =>
                      handleDeleteComment(
                        comment._id
                      )
                    }
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                )}

              </div>

              {/* =========================
                  REPLY BOX
              ========================= */}
              {replyingTo === comment._id && (
                <form
                  onSubmit={(e) =>
                    handleReplySubmit(
                      e,
                      comment._id
                    )
                  }
                  className="mt-4"
                >

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
  placeholder={`Reply to ${commentAuthor}...`}
  className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none bg-slate-50"
  rows={1}
  autoFocus
/>

                  <div className="flex justify-end gap-2 mt-2">

                    <button
                      type="button"
                      onClick={cancelReply}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        replyLoading ||
                        !replyText.trim()
                      }
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {replyLoading
                        ? "Replying..."
                        : "Reply"}
                    </button>

                  </div>

                </form>
              )}

            </div>

          </div>

          {/* =========================
              REPLIES
          ========================= */}
          {replies.length > 0 && (
            <div>
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  level={level + 1}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* =========================
            BACK
        ========================= */}
        <button
          onClick={() => navigate("/community")}
          className="text-sm text-slate-500 hover:text-indigo-600 mb-6 transition"
        >
          ← Back to Community
        </button>

        {/* =========================
            POST
        ========================= */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mt-4">

            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {authorName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {authorName}
              </p>

              <p className="text-xs text-slate-400">
                {new Date(
                  post.createdAt
                ).toLocaleString()}
              </p>
            </div>

          </div>

          {/* Content */}
          <div className="mt-7 text-slate-700 leading-7 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-7">

              {post.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-sm"
                >
                  #{tag}
                </span>
              ))}

            </div>
          )}

          {/* =========================
              ACTIONS
          ========================= */}
          <div className="border-t border-slate-200 mt-8 pt-5 flex items-center gap-5">

            {/* Upvote */}
            <button
              onClick={handleUpvote}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
            >
              <span className="text-lg">
                ▲
              </span>

              <span>
                {post.upvotes?.length || 0}
              </span>

              <span className="hidden sm:inline">
                Upvote
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={openComments}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
            >
              <span className="text-lg">
                💬
              </span>

              <span>
                {post.commentsCount || 0}
              </span>

              <span className="hidden sm:inline">
                Comments
              </span>
            </button>

          </div>

        </article>

        {/* =========================
            COMMENTS
        ========================= */}
        {commentsOpen && (
          <section
            id="comments"
            className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 scroll-mt-6"
          >

            {/* Header */}
            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold text-slate-900">
                Comments

                <span className="text-slate-400 font-normal text-base ml-2">
                  ({comments.length})
                </span>
              </h2>

              <button
                onClick={() =>
                  setCommentsOpen(false)
                }
                className="text-sm text-slate-400 hover:text-slate-700"
              >
                Close
              </button>

            </div>

            {/* =========================
                MAIN COMMENT BOX
            ========================= */}
            <form
              onSubmit={handleCommentSubmit}
              className="mt-5"
            >

             <textarea
  value={commentText}
  onChange={(e) => setCommentText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (commentText.trim()) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  }}
  placeholder="Write a comment..."
  className="input min-h-[110px] resize-y"
  maxLength={1000}
/>
              <div className="flex justify-end mt-3">

                <button
                  type="submit"
                  disabled={
                    commentLoading ||
                    !commentText.trim()
                  }
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {commentLoading
                    ? "Posting..."
                    : "Add Comment"}
                </button>

              </div>

            </form>

            {/* =========================
                COMMENTS LIST
            ========================= */}
            <div className="mt-7">

              {comments.length === 0 ? (

                <div className="text-center py-10 text-slate-400">

                  <div className="text-3xl mb-2">
                    💬
                  </div>

                  <p>
                    No comments yet.
                  </p>

                  <p className="text-sm mt-1">
                    Be the first to comment!
                  </p>

                </div>

              ) : (

                <div className="border-l-2 border-slate-200 pl-5">

                  {topLevelComments.map(
                    (comment) => (
                      <CommentItem
                        key={comment._id}
                        comment={comment}
                      />
                    )
                  )}

                </div>

              )}

            </div>

          </section>
        )}

      </div>

      {/* =========================
          SCROLL BUTTON
      ========================= */}
      <button
        onClick={() =>
          window.scrollBy({
            top: window.innerHeight * 0.8,
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

export default PostDetails;