import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const categories = [
  "All",
  "Technology",
  "Career",
  "Academics",
  "Projects",
  "Internships",
  "Placements",
  "Hackathons",
  "General",
];

const Community = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async (selectedCategory = "All") => {
    try {
      setLoading(true);
      setError("");

      const url =
        selectedCategory === "All"
          ? "/community"
          : `/community?category=${encodeURIComponent(
              selectedCategory
            )}`;

      const response = await api.get(url);

      setPosts(response.data.posts || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load community posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(category);
  }, [category]);

  const handleUpvote = async (postId) => {
    try {
      const response = await api.post(
        `/community/${postId}/upvote`
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                upvotes: Array(
                  response.data.upvotes
                ).fill(null),
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================== HEADER ==================== */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-2xl font-bold tracking-tight"
              >
                Grad
                <span className="text-indigo-600">
                  Forge
                </span>
              </button>

              <p className="text-xs text-slate-400 mt-1">
                Student Community
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="hidden sm:block px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </button>

              {/* CREATE POST */}
              <button
                type="button"
                onClick={() =>
                  navigate("/community/create")
                }
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                + Create Post
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN ==================== */}

      <main className="max-w-6xl mx-auto px-5 sm:px-6 py-8">

        {/* ==================== INTRO ==================== */}

        <section className="mb-8">

          <p className="text-sm font-semibold text-indigo-600 mb-2">
            GRADFORGE COMMUNITY
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Learn. Share. Connect.
          </h1>

          <p className="mt-2 text-slate-500 max-w-2xl">
            Ask questions, share knowledge, discover
            opportunities and connect with students
            from around the world.
          </p>

        </section>

        {/* ==================== CATEGORIES ==================== */}

        <section className="mb-7">

          <div className="flex gap-2 overflow-x-auto pb-2">

            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === item
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </section>

        {/* ==================== CONTENT ==================== */}

        {loading ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />

            <p className="text-sm text-slate-500 mt-4">
              Loading community...
            </p>

          </div>

        ) : error ? (

          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">

            <p className="text-red-600 font-medium">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchPosts(category)}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
            >
              Try Again
            </button>

          </div>

        ) : posts.length === 0 ? (

          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
              💬
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              No posts yet
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Be the first student to start the conversation.
            </p>

            {/* CREATE FIRST POST */}
            <button
              type="button"
              onClick={() =>
                navigate("/community/create")
              }
              className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Create First Post
            </button>

          </div>

        ) : (

          <div className="space-y-5">

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpvote={() =>
                  handleUpvote(post._id)
                }
                onOpen={() =>
                  navigate(`/community/${post._id}`)
                }
              />
            ))}

          </div>

        )}

      </main>

      {/* ==================== SCROLL DOWN ==================== */}

      <button
        type="button"
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


/* =========================================================
   POST CARD
========================================================= */

const PostCard = ({
  post,
  onUpvote,
  onOpen,
}) => {

  const authorName =
    post.author?.name || "GradForge Student";

  const initial =
    authorName.charAt(0).toUpperCase();

  const time = new Date(
    post.createdAt
  ).toLocaleDateString();

  return (
    <article
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-indigo-200 hover:shadow-sm transition cursor-pointer"
      onClick={onOpen}
    >

      {/* Author */}

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            {initial}
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              {authorName}
            </p>

            <p className="text-xs text-slate-400">
              {time}
            </p>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          {post.category}
        </span>

      </div>

      {/* Content */}

      <div className="mt-5">

        <h2 className="text-xl font-bold text-slate-900">
          {post.title}
        </h2>

        <p className="text-sm text-slate-600 mt-3 leading-6 line-clamp-4">
          {post.content}
        </p>

      </div>

      {/* Tags */}

      {post.tags?.length > 0 && (

        <div className="flex flex-wrap gap-2 mt-4">

          {post.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-xs"
            >
              #{tag}
            </span>
          ))}

        </div>

      )}

      {/* Actions */}

      <div
        className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          type="button"
          onClick={onUpvote}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          👍
          <span>
            {post.upvotes?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          💬
          <span>
            {post.commentsCount || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="ml-auto text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View Post →
        </button>

      </div>

    </article>
  );
};

export default Community;