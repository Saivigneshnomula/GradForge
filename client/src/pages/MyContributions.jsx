import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyContributions() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects/my");

      setProjects(response.data.projects || []);
    } catch (err) {
      console.error("Fetch contributions error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your contributions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const getStatus = (status) => {
    if (status === "approved") {
      return {
        label: "Approved",
        icon: "✓",
        color: "bg-green-100 text-green-700",
        border: "border-green-200 bg-green-50",
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        icon: "✕",
        color: "bg-red-100 text-red-700",
        border: "border-red-200 bg-red-50",
      };
    }

    return {
      label: "Pending Review",
      icon: "⏳",
      color: "bg-amber-100 text-amber-700",
      border: "border-amber-200 bg-amber-50",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Contributions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your project submissions and approval status
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              ← Project Hub
            </button>

            <button
              type="button"
              onClick={() => navigate("/projects/create")}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Contribute
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* Summary */}
        {!loading && !error && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Contributions
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projects.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Approved
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {
                  projects.filter(
                    (project) =>
                      project.status === "approved"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {
                  projects.filter(
                    (project) =>
                      project.status === "pending"
                  ).length
                }
              </p>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-white"
              />
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

            <div className="text-4xl">
              ⚠️
            </div>

            <h2 className="mt-3 font-semibold text-red-900">
              Unable to load contributions
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchMyProjects}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                🚀
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No contributions yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Share your project with the GradForge community
                and help other students learn from your work.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/projects/create")
                }
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Contribute Your First Project
              </button>

            </div>
          )}

        {/* Contributions */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="space-y-5">

              {projects.map((project) => {
                const status = getStatus(project.status);

                return (
                  <article
                    key={project._id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                      {/* Project */}
                      <div className="flex-1">

                        <div className="mb-3 flex flex-wrap gap-2">

                          <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                            {project.technology}
                          </span>

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {project.department}
                          </span>

                          <span
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${status.color}`}
                          >
                            {status.icon} {status.label}
                          </span>

                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                          {project.title}
                        </h2>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                          {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">

                          <span>
                            Submitted{" "}
                            {new Date(
                              project.createdAt
                            ).toLocaleDateString()}
                          </span>

                          <span>
                            {project.projectType}
                          </span>

                          <span>
                            {project.difficulty}
                          </span>

                        </div>

                      </div>

                      {/* Status */}
                      <div
                        className={`w-full rounded-xl border p-5 lg:w-80 ${status.border}`}
                      >

                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Contribution Status
                        </p>

                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          {status.label}
                        </h3>

                        {/* Pending */}
                        {project.status === "pending" && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Your project has been submitted
                            successfully and is waiting for
                            administrator review.
                          </p>
                        )}

                        {/* Approved */}
                        {project.status === "approved" && (
                          <>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Your project has been approved
                              and is now publicly available
                              in Project Hub.
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/projects/${project._id}`
                                )
                              }
                              className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                            >
                              View Published Project
                            </button>
                          </>
                        )}

                        {/* Rejected */}
                        {project.status === "rejected" && (
                          <>
                            <p className="mt-2 text-sm leading-6 text-red-700">
                              <span className="font-semibold">
                                Reason:
                              </span>{" "}
                              {project.rejectionReason ||
                                "No rejection reason was provided."}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/projects/${project._id}/edit`
                                )
                              }
                              className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              Edit & Resubmit
                            </button>
                          </>
                        )}

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default MyContributions;