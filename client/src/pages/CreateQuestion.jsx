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

const CreateQuestion = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
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

    if (
      !form.title.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Title and description are required."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await api.post("/questions", {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags,
      });

      navigate(
        `/ask-solve/${response.data.question._id}`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create question."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate("/ask-solve")}
          className="text-sm text-slate-500 hover:text-indigo-600 mb-6"
        >
          ← Back to Ask & Solve
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Ask a Question
        </h1>

        <p className="text-slate-500 mt-1 mb-6">
          Describe your problem clearly so the community
          can help you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
        >

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="label">
              Question Title <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Why is my React component re-rendering?"
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
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Describe your question <span>*</span>
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain your problem, what you tried, and what result you expected..."
              className="input min-h-[240px] resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="label">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, javascript, nodejs"
              className="input"
            />

            <p className="text-xs text-slate-400 mt-2">
              Separate tags with commas.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/ask-solve")
              }
              className="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading
                ? "Posting..."
                : "Post Question"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateQuestion;