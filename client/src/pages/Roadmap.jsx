import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const Roadmaps = () => {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await api.get("/roadmaps");

        setRoadmaps(response.data.roadmaps);
      } catch (error) {
        console.error(error);

        setError("Unable to load roadmaps.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          Loading roadmaps...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold tracking-tight"
        >
          Grad<span className="text-indigo-600">Forge</span>
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-slate-600 hover:text-indigo-600"
        >
          ← Dashboard
        </button>

      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">

          <p className="text-sm font-semibold text-indigo-600 mb-2">
            CAREER ROADMAPS
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
            Choose your career path
          </h1>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Follow a structured learning path designed to take
            you from fundamentals to job-ready skills.
          </p>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Roadmaps */}
        {roadmaps.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-500">
              No roadmaps available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {roadmaps.map((roadmap) => {

              const totalTopics = roadmap.modules.reduce(
                (total, module) =>
                  total + module.topics.length,
                0
              );

              return (
                <div
                  key={roadmap._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition"
                >

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl mb-5">
                    🧭
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {roadmap.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {roadmap.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-5">

                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {roadmap.level}
                    </span>

                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {totalTopics} Topics
                    </span>

                    {roadmap.estimatedHours > 0 && (
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        {roadmap.estimatedHours} Hours
                      </span>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      navigate(`/roadmaps/${roadmap._id}`)
                    }
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                  >
                    View Roadmap →
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
};

export default Roadmaps;