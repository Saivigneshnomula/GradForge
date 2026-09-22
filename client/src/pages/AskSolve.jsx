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

const AskSolve = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const url =
        selectedCategory === "All"
          ? "/questions"
          : `/questions?category=${encodeURIComponent(
              selectedCategory
            )}`;

      const response = await api.get(url);

      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Ask & Solve
            </h1>

            <p className="text-slate-500 mt-1">
              Ask questions, share knowledge and help other students.
            </p>
          </div>

          {/* Header Buttons */}
          <div className="flex items-center gap-3">

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition"
            >
              Dashboard
            </button>

            {/* Ask Question */}
            <button
              type="button"
              onClick={() => navigate("/ask-solve/create")}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              + Ask Question
            </button>

          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Questions */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <div className="text-4xl mb-3">
              ❓
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No questions yet
            </h2>

            <p className="text-slate-500 mt-1 mb-5">
              Be the first person to ask a question.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/ask-solve/create")
              }
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Ask Question
            </button>

          </div>
        ) : (
          <div className="space-y-4">

            {questions.map((question) => {
              const authorName =
                question.author?.name ||
                "Unknown User";

              return (
                <button
                  key={question._id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/ask-solve/${question._id}`
                    )
                  }
                  className="w-full text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row gap-5">

                    {/* Stats */}
                    <div className="flex md:flex-col gap-4 md:w-24 shrink-0">

                      <div className="text-center">
                        <p className="font-bold text-slate-800">
                          {question.upvotes?.length || 0}
                        </p>

                        <p className="text-xs text-slate-400">
                          votes
                        </p>
                      </div>

                      <div className="text-center">
                        <p
                          className={`font-bold ${
                            question.answersCount > 0
                              ? "text-green-600"
                              : "text-slate-800"
                          }`}
                        >
                          {question.answersCount || 0}
                        </p>

                        <p className="text-xs text-slate-400">
                          answers
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="font-bold text-slate-800">
                          {question.views || 0}
                        </p>

                        <p className="text-xs text-slate-400">
                          views
                        </p>
                      </div>

                    </div>

                    {/* Question */}
                    <div className="flex-1">

                      <div className="flex flex-wrap gap-2 mb-2">

                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold">
                          {question.category}
                        </span>

                        {question.acceptedAnswer && (
                          <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-semibold">
                            ✓ Solved
                          </span>
                        )}

                      </div>

                      <h2 className="text-lg font-bold text-slate-900">
                        {question.title}
                      </h2>

                      <p className="text-slate-500 mt-2 line-clamp-2">
                        {question.description}
                      </p>

                      {/* Tags */}
                      {question.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">

                          {question.tags.map(
                            (tag, index) => (
                              <span
                                key={`${tag}-${index}`}
                                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500"
                              >
                                #{tag}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {/* Author */}
                      <div className="flex items-center gap-2 mt-4">

                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {authorName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="text-xs text-slate-500">
                          {authorName}
                        </span>

                        <span className="text-xs text-slate-300">
                          •
                        </span>

                        <span className="text-xs text-slate-400">
                          {new Date(
                            question.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                  </div>
                </button>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default AskSolve;