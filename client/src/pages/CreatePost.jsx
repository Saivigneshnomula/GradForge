import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const categories = [
  "Technology",
  "Career",
  "Academics",
  "Projects",
  "Internships",
  "Placements",
  "Hackathons",
  "General",
];

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Technology",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await api.post("/community", {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        tags,
      });

      navigate("/community");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/community")}
            className="text-sm text-slate-500 hover:text-indigo-600 mb-4"
          >
            ← Back to Community
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Create a Post
          </h1>

          <p className="text-slate-500 mt-1">
            Share something useful with the GradForge community.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
        >
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="label">
              Post Title <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Best resources to learn React?"
              className="input"
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <label className="label">
              Category <span>*</span>
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="label">
              Content <span>*</span>
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your question, idea, experience or resource..."
              className="input min-h-[220px] resize-y"
            />

            <p className="text-xs text-slate-400 mt-2">
              Be clear and respectful. Help other students understand your
              post.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags</label>

            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, javascript, frontend"
              className="input"
            />

            <p className="text-xs text-slate-400 mt-2">
              Separate tags using commas.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/community")}
              className="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;