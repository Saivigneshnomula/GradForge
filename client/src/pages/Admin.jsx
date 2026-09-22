import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LOGO = (
  <svg
    width="38"
    height="38"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="14" fill="url(#grad)" />
    <path
      d="M13 31V17L24 12L35 17V31L24 36L13 31Z"
      stroke="white"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M18 27V20L24 17L30 20V27L24 30L18 27Z"
      stroke="white"
      strokeWidth="2"
    />
    <defs>
      <linearGradient id="grad" x1="4" y1="4" x2="44" y2="44">
        <stop stopColor="#4f46e5" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
  </svg>
);

const emptyQuestion = {
  question: "",
  answer: "",
  category: "JavaScript",
  difficulty: "Easy",
  tags: "",
  isActive: true,
};

const emptyOpportunity = {
  title: "",
  company: "",
  type: "job",
  location: "",
  mode: "Remote",
  description: "",
  skills: "",
  themes: "",
  relatedIdeas: "",
  deadline: "",
  applicationUrl: "",
  source: "GradForge Admin",
  sourceUrl: "",
  salary: "",
  prize: "",
  companyLogo: "",
  isActive: true,
};

function Admin() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");

  const [questions, setQuestions] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [opportunityForm, setOpportunityForm] =
    useState(emptyOpportunity);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const [questionSearch, setQuestionSearch] = useState("");
  const [opportunitySearch, setOpportunitySearch] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [questionsRes, opportunitiesRes] = await Promise.all([
        api.get("/admin/interviews"),
        api.get("/admin/opportunities"),
      ]);

      setQuestions(
        Array.isArray(questionsRes.data) ? questionsRes.data : []
      );

      setOpportunities(
        Array.isArray(opportunitiesRes.data)
          ? opportunitiesRes.data
          : []
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        navigate("/dashboard");
        return;
      }

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const updateQuestionField = (field, value) => {
    setQuestionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateOpportunityField = (field, value) => {
    setOpportunityForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveQuestion = async (e) => {
    e.preventDefault();

    if (!questionForm.question.trim() || !questionForm.answer.trim()) {
      showMessage("Question and answer are required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...questionForm,
        tags: questionForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingQuestion) {
        const response = await api.put(
          `/admin/interviews/${editingQuestion._id}`,
          payload
        );

        setQuestions((prev) =>
          prev.map((item) =>
            item._id === editingQuestion._id
              ? response.data
              : item
          )
        );

        showMessage("Question updated successfully.");
      } else {
        const response = await api.post(
          "/admin/interviews",
          payload
        );

        setQuestions((prev) => [response.data, ...prev]);

        showMessage("Question added successfully.");
      }

      setQuestionForm(emptyQuestion);
      setEditingQuestion(null);
    } catch (error) {
      console.error(error);
      showMessage(
        error.response?.data?.message ||
          "Failed to save question."
      );
    } finally {
      setSaving(false);
    }
  };

  const editQuestion = (question) => {
    setEditingQuestion(question);

    setQuestionForm({
      question: question.question || "",
      answer: question.answer || "",
      category: question.category || "JavaScript",
      difficulty: question.difficulty || "Easy",
      tags: Array.isArray(question.tags)
        ? question.tags.join(", ")
        : "",
      isActive: question.isActive !== false,
    });

    setActiveSection("questions");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this interview question?")) {
      return;
    }

    try {
      await api.delete(`/admin/interviews/${id}`);

      setQuestions((prev) =>
        prev.filter((item) => item._id !== id)
      );

      showMessage("Question deleted.");
    } catch (error) {
      console.error(error);
      showMessage("Failed to delete question.");
    }
  };

  const toggleQuestion = async (question) => {
    try {
      const response = await api.put(
        `/admin/interviews/${question._id}`,
        {
          isActive: !question.isActive,
        }
      );

      setQuestions((prev) =>
        prev.map((item) =>
          item._id === question._id ? response.data : item
        )
      );
    } catch (error) {
      console.error(error);
      showMessage("Failed to update question.");
    }
  };

  const saveOpportunity = async (e, sectionType) => {
    e.preventDefault();

    if (!opportunityForm.title.trim()) {
      showMessage("Title is required.");
      return;
    }

    if (!opportunityForm.company.trim()) {
      showMessage("Company/organizer is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...opportunityForm,
        type: sectionType || opportunityForm.type,
        skills: opportunityForm.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        themes: opportunityForm.themes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        relatedIdeas: opportunityForm.relatedIdeas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        deadline: opportunityForm.deadline
          ? new Date(opportunityForm.deadline)
          : null,
      };

      if (editingOpportunity) {
        const response = await api.put(
          `/admin/opportunities/${editingOpportunity._id}`,
          payload
        );

        setOpportunities((prev) =>
          prev.map((item) =>
            item._id === editingOpportunity._id
              ? response.data
              : item
          )
        );

        showMessage("Opportunity updated successfully.");
      } else {
        const response = await api.post(
          "/admin/opportunities",
          payload
        );

        setOpportunities((prev) => [
          response.data,
          ...prev,
        ]);

        showMessage("Opportunity added successfully.");
      }

      setOpportunityForm(emptyOpportunity);
      setEditingOpportunity(null);
    } catch (error) {
      console.error(error);
      showMessage(
        error.response?.data?.message ||
          "Failed to save opportunity."
      );
    } finally {
      setSaving(false);
    }
  };

  const editOpportunity = (item) => {
    setEditingOpportunity(item);

    const deadline = item.deadline
      ? new Date(item.deadline).toISOString().slice(0, 16)
      : "";

    setOpportunityForm({
      title: item.title || "",
      company: item.company || "",
      type: item.type || "job",
      location: item.location || "",
      mode: item.mode || "Remote",
      description: item.description || "",
      skills: Array.isArray(item.skills)
        ? item.skills.join(", ")
        : "",
      themes: Array.isArray(item.themes)
        ? item.themes.join(", ")
        : "",
      relatedIdeas: Array.isArray(item.relatedIdeas)
        ? item.relatedIdeas.join(", ")
        : "",
      deadline,
      applicationUrl: item.applicationUrl || "",
      source: item.source || "GradForge Admin",
      sourceUrl: item.sourceUrl || "",
      salary: item.salary || "",
      prize: item.prize || "",
      companyLogo: item.companyLogo || "",
      isActive: item.isActive !== false,
    });

    setActiveSection(
      item.type === "hackathon"
        ? "hackathons"
        : item.type === "job"
        ? "jobs"
        : "interviews"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteOpportunity = async (id) => {
    if (!window.confirm("Delete this opportunity?")) {
      return;
    }

    try {
      await api.delete(`/admin/opportunities/${id}`);

      setOpportunities((prev) =>
        prev.filter((item) => item._id !== id)
      );

      showMessage("Opportunity deleted.");
    } catch (error) {
      console.error(error);
      showMessage("Failed to delete opportunity.");
    }
  };

  const toggleOpportunity = async (item) => {
    try {
      const response = await api.put(
        `/admin/opportunities/${item._id}`,
        {
          isActive: !item.isActive,
        }
      );

      setOpportunities((prev) =>
        prev.map((opportunity) =>
          opportunity._id === item._id
            ? response.data
            : opportunity
        )
      );
    } catch (error) {
      console.error(error);
      showMessage("Failed to update opportunity.");
    }
  };

  const filteredQuestions = useMemo(() => {
    const search = questionSearch.toLowerCase().trim();

    if (!search) return questions;

    return questions.filter((item) => {
      const text = [
        item.question,
        item.answer,
        item.category,
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }, [questions, questionSearch]);

  const filteredOpportunities = useMemo(() => {
    const search = opportunitySearch.toLowerCase().trim();

    if (!search) return opportunities;

    return opportunities.filter((item) => {
      const text = [
        item.title,
        item.company,
        item.location,
        item.type,
        ...(item.skills || []),
        ...(item.themes || []),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }, [opportunities, opportunitySearch]);

  const jobs = filteredOpportunities.filter(
    (item) => item.type === "job"
  );

  const hackathons = filteredOpportunities.filter(
    (item) => item.type === "hackathon"
  );

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "questions",
      label: "Interview Questions",
      icon: "Q",
    },
    {
      id: "jobs",
      label: "Jobs",
      icon: "J",
    },
    {
      id: "hackathons",
      label: "Hackathons",
      icon: "H",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setActiveSection("dashboard")}
            className="flex items-center gap-3"
          >
            {LOGO}

            <div className="text-left">
              <div className="text-lg font-extrabold tracking-tight text-slate-900">
                GradForge
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                Admin Console
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:block"
            >
              Student Dashboard
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        {/* SIDEBAR */}
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r border-slate-200 bg-white p-5 lg:block">
          <div className="mb-6 rounded-2xl bg-indigo-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Administration
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-800">
              Manage GradForge content
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                  {item.icon}
                </span>

                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {/* MOBILE NAV */}
          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-sm font-semibold text-slate-500">
                Loading admin panel...
              </div>
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeSection === "dashboard" && (
                <DashboardSection
                  questions={questions}
                  opportunities={opportunities}
                  setActiveSection={setActiveSection}
                />
              )}

              {/* QUESTIONS */}
              {activeSection === "questions" && (
                <section>
                  <SectionHeader
                    title="Interview Questions"
                    description="Create and manage questions shown in the GradForge interview preparation hub."
                    buttonText={
                      editingQuestion
                        ? "Cancel Edit"
                        : "+ Add Question"
                    }
                    onButtonClick={() => {
                      setEditingQuestion(null);
                      setQuestionForm(emptyQuestion);
                    }}
                  />

                  <form
                    onSubmit={saveQuestion}
                    className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-5">
                      <h2 className="text-lg font-bold text-slate-900">
                        {editingQuestion
                          ? "Edit Question"
                          : "Add Interview Question"}
                      </h2>
                    </div>

                    <div className="grid gap-5">
                      <Field label="Question">
                        <input
                          className="admin-input"
                          value={questionForm.question}
                          onChange={(e) =>
                            updateQuestionField(
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="e.g. What is event delegation in JavaScript?"
                        />
                      </Field>

                      <Field label="Answer">
                        <textarea
                          className="admin-input min-h-[150px] resize-y"
                          value={questionForm.answer}
                          onChange={(e) =>
                            updateQuestionField(
                              "answer",
                              e.target.value
                            )
                          }
                          placeholder="Write a clear interview-ready answer..."
                        />
                      </Field>

                      <div className="grid gap-5 md:grid-cols-3">
                        <Field label="Category">
                          <select
                            className="admin-input"
                            value={questionForm.category}
                            onChange={(e) =>
                              updateQuestionField(
                                "category",
                                e.target.value
                              )
                            }
                          >
                            {[
                              "HR",
                              "JavaScript",
                              "React",
                              "Node.js",
                              "MongoDB",
                              "DSA",
                              "MERN",
                              "DevOps",
                              "Cloud",
                            ].map((item) => (
                              <option key={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Difficulty">
                          <select
                            className="admin-input"
                            value={questionForm.difficulty}
                            onChange={(e) =>
                              updateQuestionField(
                                "difficulty",
                                e.target.value
                              )
                            }
                          >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </Field>

                        <Field label="Tags">
                          <input
                            className="admin-input"
                            value={questionForm.tags}
                            onChange={(e) =>
                              updateQuestionField(
                                "tags",
                                e.target.value
                              )
                            }
                            placeholder="javascript, promises, async"
                          />
                        </Field>
                      </div>

                      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={questionForm.isActive}
                          onChange={(e) =>
                            updateQuestionField(
                              "isActive",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 accent-indigo-600"
                        />
                        Visible to students
                      </label>

                      <div className="flex justify-end gap-3">
                        {editingQuestion && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingQuestion(null);
                              setQuestionForm(emptyQuestion);
                            }}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          type="submit"
                          disabled={saving}
                          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {saving
                            ? "Saving..."
                            : editingQuestion
                            ? "Update Question"
                            : "Add Question"}
                        </button>
                      </div>
                    </div>
                  </form>

                  <SearchBox
                    value={questionSearch}
                    onChange={setQuestionSearch}
                    placeholder="Search questions..."
                  />

                  <div className="mt-4 space-y-3">
                    {filteredQuestions.map((question) => (
                      <div
                        key={question._id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap gap-2">
                              <Badge>
                                {question.category}
                              </Badge>

                              <Badge>
                                {question.difficulty}
                              </Badge>

                              <Badge
                                active={question.isActive}
                              >
                                {question.isActive
                                  ? "Active"
                                  : "Hidden"}
                              </Badge>
                            </div>

                            <h3 className="font-bold text-slate-900">
                              {question.question}
                            </h3>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                              {question.answer}
                            </p>

                            {question.tags?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {question.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs font-medium text-indigo-600"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                toggleQuestion(question)
                              }
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
                            >
                              {question.isActive
                                ? "Hide"
                                : "Show"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                editQuestion(question)
                              }
                              className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteQuestion(question._id)
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                      <EmptyState text="No interview questions found." />
                    )}
                  </div>
                </section>
              )}

              {/* JOBS */}
              {activeSection === "jobs" && (
                <OpportunitySection
                  title="Jobs"
                  description="Publish real job openings for students. A job is a role vacancy that students can apply for."
                  type="job"
                  form={opportunityForm}
                  setForm={setOpportunityForm}
                  updateField={updateOpportunityField}
                  onSubmit={(e) => saveOpportunity(e, "job")}
                  saving={saving}
                  editing={editingOpportunity}
                  cancelEdit={() => {
                    setEditingOpportunity(null);
                    setOpportunityForm(emptyOpportunity);
                  }}
                  items={jobs}
                  search={opportunitySearch}
                  setSearch={setOpportunitySearch}
                  editItem={editOpportunity}
                  deleteItem={deleteOpportunity}
                  toggleItem={toggleOpportunity}
                />
              )}

              {/* HACKATHONS */}
              {activeSection === "hackathons" && (
                <OpportunitySection
                  title="Hackathons"
                  description="Publish current and upcoming hackathons for students."
                  type="hackathon"
                  form={opportunityForm}
                  setForm={setOpportunityForm}
                  updateField={updateOpportunityField}
                  onSubmit={(e) => saveOpportunity(e, "hackathon")}
                  saving={saving}
                  editing={editingOpportunity}
                  cancelEdit={() => {
                    setEditingOpportunity(null);
                    setOpportunityForm(emptyOpportunity);
                  }}
                  items={hackathons}
                  search={opportunitySearch}
                  setSearch={setOpportunitySearch}
                  editItem={editOpportunity}
                  deleteItem={deleteOpportunity}
                  toggleItem={toggleOpportunity}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function DashboardSection({
  questions,
  opportunities,
  setActiveSection,
}) {
  const activeQuestions = questions.filter(
    (item) => item.isActive
  ).length;

  const jobs = opportunities.filter(
    (item) => item.type === "job"
  );

  const hackathons = opportunities.filter(
    (item) => item.type === "hackathon"
  );

  const activeOpportunities = opportunities.filter(
    (item) => item.isActive
  ).length;

  const cards = [
    {
      label: "Interview Questions",
      value: questions.length,
      active: activeQuestions,
      section: "questions",
      icon: "Q",
    },
    {
      label: "Jobs",
      value: jobs.length,
      active: jobs.filter((x) => x.isActive).length,
      section: "jobs",
      icon: "J",
    },
    {
      label: "Hackathons",
      value: hackathons.length,
      active: hackathons.filter((x) => x.isActive).length,
      section: "hackathons",
      icon: "H",
    },
    {
      label: "Active Content",
      value: activeQuestions + activeOpportunities,
      active: activeQuestions + activeOpportunities,
      section: "dashboard",
      icon: "✓",
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
          GradForge Control Center
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Manage the career content students see across
          GradForge.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => setActiveSection(card.section)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600">
                {card.icon}
              </div>

              <span className="text-xs font-bold text-emerald-600">
                {card.active} active
              </span>
            </div>

            <div className="mt-5 text-3xl font-black text-slate-900">
              {card.value}
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-500">
              {card.label}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-widest text-indigo-100">
            Content Management
          </div>

          <h2 className="mt-2 text-2xl font-black">
            Keep GradForge fresh.
          </h2>

          <p className="mt-2 text-sm leading-6 text-indigo-100">
            Add interview questions, jobs and hackathons
            without touching the database manually.
          </p>
        </div>
      </div>
    </section>
  );
}

function OpportunitySection({
  title,
  description,
  type,
  form,
  setForm,
  updateField,
  onSubmit,
  saving,
  editing,
  cancelEdit,
  items,
  search,
  setSearch,
  editItem,
  deleteItem,
  toggleItem,
}) {
  return (
    <section>
      <SectionHeader
        title={title}
        description={description}
        buttonText={editing ? "Cancel Edit" : "+ Add"}
        onButtonClick={() => {
          if (editing) {
            cancelEdit();
          } else {
            setForm({
              ...emptyOpportunity,
              type,
            });
          }
        }}
      />

      <form
        onSubmit={onSubmit}
        className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-2 text-lg font-bold">
          {editing ? "Edit Opportunity" : `Add ${title}`}
        </h2>

        

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label={
              type === "hackathon"
                ? "Hackathon Name"
                : "Job Title"
            }
          >
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              placeholder={
                type === "hackathon"
                  ? "Hackathon name"
                  : type === "job"
                  ? "Software Development Engineer"
                  : "Software Development Engineer"
              }
            />
          </Field>

          <Field
            label={
              type === "hackathon"
                ? "Organizer"
                : "Company"
            }
          >
            <input
              className="admin-input"
              value={form.company}
              onChange={(e) =>
                updateField("company", e.target.value)
              }
              placeholder="Company / organizer"
            />
          </Field>

          <Field label="Location">
            <input
              className="admin-input"
              value={form.location}
              onChange={(e) =>
                updateField("location", e.target.value)
              }
              placeholder="Hyderabad / India / Online"
            />
          </Field>

          <Field label="Mode">
            <select
              className="admin-input"
              value={form.mode}
              onChange={(e) =>
                updateField("mode", e.target.value)
              }
            >
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
              <option>Online</option>
              <option>Unknown</option>
            </select>
          </Field>

          <Field label="Deadline">
            <input
              type="datetime-local"
              className="admin-input"
              value={form.deadline}
              onChange={(e) =>
                updateField("deadline", e.target.value)
              }
            />
          </Field>

          <Field label="Application URL">
            <input
              type="url"
              className="admin-input"
              value={form.applicationUrl}
              onChange={(e) =>
                updateField(
                  "applicationUrl",
                  e.target.value
                )
              }
              placeholder="https://..."
            />
          </Field>

          <Field label="Skills">
            <input
              className="admin-input"
              value={form.skills}
              onChange={(e) =>
                updateField("skills", e.target.value)
              }
              placeholder="JavaScript, React, Node.js"
            />
          </Field>

          <Field
            label={
              type === "hackathon"
                ? "Themes"
                : "Related Skills / Areas"
            }
          >
            <input
              className="admin-input"
              value={form.themes}
              onChange={(e) =>
                updateField("themes", e.target.value)
              }
              placeholder="AI, Web Development, Cloud"
            />
          </Field>

          <Field
            label={
              type === "hackathon"
                ? "Prize"
                : "Salary"
            }
          >
            <input
              className="admin-input"
              value={
                type === "hackathon"
                  ? form.prize
                  : form.salary
              }
              onChange={(e) =>
                updateField(
                  type === "hackathon"
                    ? "prize"
                    : "salary",
                  e.target.value
                )
              }
              placeholder={
                type === "hackathon"
                  ? "₹40,000"
                  : "₹8 LPA"
              }
            />
          </Field>

          <Field label="Source URL">
            <input
              type="url"
              className="admin-input"
              value={form.sourceUrl}
              onChange={(e) =>
                updateField("sourceUrl", e.target.value)
              }
              placeholder="Source page"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className="admin-input min-h-[130px] resize-y"
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Describe the opportunity..."
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Related Ideas">
              <input
                className="admin-input"
                value={form.relatedIdeas}
                onChange={(e) =>
                  updateField(
                    "relatedIdeas",
                    e.target.value
                  )
                }
                placeholder="AI agents, full stack, DevOps"
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                updateField("isActive", e.target.checked)
              }
              className="h-4 w-4 accent-indigo-600"
            />
            Visible to students
          </label>

          <div className="flex gap-3">
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update"
                : `Add ${
                    type === "hackathon"
                      ? "Hackathon"
                      : type === "job"
                      ? "Job"
                      : "Interview"
                  }`}
            </button>
          </div>
        </div>
      </form>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder={`Search ${title.toLowerCase()}...`}
      />

      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>
                    {item.type === "hackathon"
                      ? "Hackathon"
                      : "Job"}
                  </Badge>

                  <Badge active={item.isActive}>
                    {item.isActive
                      ? "Active"
                      : "Hidden"}
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm font-semibold text-indigo-600">
                  {item.company}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                  {item.location && (
                    <span>📍 {item.location}</span>
                  )}

                  {item.mode && (
                    <span>◉ {item.mode}</span>
                  )}

                  {item.deadline && (
                    <span>
                      Deadline:{" "}
                      {new Date(
                        item.deadline
                      ).toLocaleDateString()}
                    </span>
                  )}

                  {item.type === "hackathon" &&
                    item.prize && (
                      <span>
                        🏆 {item.prize}
                      </span>
                    )}

                  {item.type === "job" &&
                    item.salary && (
                      <span>
                        💰 {item.salary}
                      </span>
                    )}
                </div>

                {item.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}

                {item.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => toggleItem(item)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
                >
                  {item.isActive ? "Hide" : "Show"}
                </button>

                <button
                  type="button"
                  onClick={() => editItem(item)}
                  className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteItem(item._id)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <EmptyState
            text={`No ${title.toLowerCase()} found.`}
          />
        )}
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onButtonClick}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
      >
        {buttonText}
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      className="admin-input w-full bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Badge({ children, active }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
        active === false
          ? "bg-slate-100 text-slate-500"
          : "bg-indigo-50 text-indigo-700"
      }`}
    >
      {children}
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="text-sm font-semibold text-slate-500">
        {text}
      </div>
    </div>
  );
}

export default Admin;