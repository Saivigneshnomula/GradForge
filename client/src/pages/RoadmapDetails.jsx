import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

const RoadmapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapResponse, progressResponse] =
          await Promise.all([
            api.get(`/roadmaps/${id}`),
            api.get(`/progress/${id}`),
          ]);

        setRoadmap(roadmapResponse.data.roadmap);
        setProgress(progressResponse.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isCompleted = (topicId) => {
    return progress?.completedTopics?.some(
      (completedId) =>
        completedId.toString() === topicId.toString()
    );
  };

  const handleComplete = async (topicId) => {
    try {
      if (isCompleted(topicId)) {
        await api.delete(
          `/progress/${id}/topics/${topicId}/complete`
        );
      } else {
        await api.post(
          `/progress/${id}/topics/${topicId}/complete`
        );
      }

      // Refresh progress
      const response = await api.get(`/progress/${id}`);

      setProgress(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          Loading roadmap...
        </p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error || "Roadmap not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">

        <button
          onClick={() => navigate("/roadmaps")}
          className="text-2xl font-bold"
        >
          Grad<span className="text-indigo-600">Forge</span>
        </button>

        <button
          onClick={() => navigate("/roadmaps")}
          className="text-sm text-slate-600 hover:text-indigo-600"
        >
          ← All Roadmaps
        </button>

      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8">

          <div className="flex flex-wrap gap-2 mb-4">

            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
              {roadmap.level}
            </span>

            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {roadmap.category}
            </span>

          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
            {roadmap.title}
          </h1>

          <p className="text-slate-500 mt-3 max-w-3xl">
            {roadmap.description}
          </p>

          {/* Progress */}
          <div className="mt-8">

            <div className="flex justify-between mb-2">

              <span className="text-sm font-medium text-slate-700">
                Your progress
              </span>

              <span className="text-sm font-bold text-indigo-600">
                {progress?.percentage || 0}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{
                  width: `${progress?.percentage || 0}%`,
                }}
              />

            </div>

            <p className="text-xs text-slate-400 mt-2">
              {progress?.completedTopics?.length || 0} of{" "}
              {progress?.totalTopics || 0} topics completed
            </p>

          </div>

        </div>

        {/* Modules */}
        <div className="mt-8 space-y-5">

          {roadmap.modules
            .sort((a, b) => a.order - b.order)
            .map((module, moduleIndex) => (

              <div
                key={module._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >

                {/* Module header */}
                <div className="p-6 border-b border-slate-100">

                  <div className="flex items-start gap-4">

                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                      {moduleIndex + 1}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {module.title}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        {module.description}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Topics */}
                <div className="divide-y divide-slate-100">

                  {module.topics
                    .sort((a, b) => a.order - b.order)
                    .map((topic) => {

                      const completed = isCompleted(topic._id);

                      return (
                        <div
                          key={topic._id}
                          className="p-5 flex items-start gap-4 hover:bg-slate-50 transition"
                        >

                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() =>
                              handleComplete(topic._id)
                            }
                            className="mt-1 w-5 h-5 accent-indigo-600 cursor-pointer"
                          />

                          <div className="flex-1">

                            <h3
                              className={`font-medium ${
                                completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-800"
                              }`}
                            >
                              {topic.title}
                            </h3>

                            {topic.description && (
                              <p className="text-sm text-slate-500 mt-1">
                                {topic.description}
                              </p>
                            )}

                          </div>

                          {completed && (
                            <span className="text-xs font-semibold text-green-600">
                              Completed
                            </span>
                          )}

                        </div>
                      );
                    })}

                </div>

              </div>

            ))}

        </div>

      </main>

    </div>
  );
};

export default RoadmapDetails;