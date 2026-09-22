import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

/* =========================================================
   GRADFORGE LOGO
========================================================= */

const GradForgeLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-900/30">
        <svg
          width="29"
          height="29"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Graduation cap */}
          <path
            d="M5 17.5L24 8L43 17.5L24 27L5 17.5Z"
            fill="white"
          />

          {/* Cap lower section */}
          <path
            d="M11 21V29.5C11 29.5 16.5 37 24 37C31.5 37 37 29.5 37 29.5V21"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tassel */}
          <path
            d="M43 18V29"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle
            cx="43"
            cy="32"
            r="2"
            fill="white"
          />
        </svg>
      </div>

      <div>
        <div className="text-xl font-black tracking-tight text-white">
          GradForge
        </div>

        <div className="text-[9px] font-bold tracking-[0.28em] text-violet-200">
          FORGE YOUR FUTURE
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PROFILE
========================================================= */

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    profilePhoto: "",
    linkedinProfile: "",
    githubProfile: "",

    education: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
    },

    skills: "",
    interests: "",
    careerGoals: "",
    achievements: "",
    contributions: "",

    projects: [],
    certifications: [],
  });

  /* =========================================================
     FETCH PROFILE
  ========================================================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");

        const user = response.data.user;

        setProfile(user);

        setForm({
          name: user.name || "",
          mobile: user.mobile || "",
          profilePhoto: user.profilePhoto || "",
          linkedinProfile: user.linkedinProfile || "",
          githubProfile: user.githubProfile || "",

          education: {
            institution:
              user.education?.institution || "",
            degree:
              user.education?.degree || "",
            fieldOfStudy:
              user.education?.fieldOfStudy || "",
            startYear:
              user.education?.startYear || "",
            endYear:
              user.education?.endYear || "",
          },

          skills: user.skills?.join(", ") || "",
          interests:
            user.interests?.join(", ") || "",
          careerGoals:
            user.careerGoals?.join(", ") || "",
          achievements:
            user.achievements?.join("\n") || "",
          contributions:
            user.contributions?.join("\n") || "",

          projects: user.projects || [],
          certifications:
            user.certifications || [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =========================================================
     BASIC INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     EDUCATION CHANGE
  ========================================================= */

  const handleEducationChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value,
      },
    }));
  };

  /* =========================================================
     PROJECT CHANGE
  ========================================================= */

  const handleProjectChange = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const projects = [...prev.projects];

      projects[index] = {
        ...projects[index],
        [field]: value,
      };

      return {
        ...prev,
        projects,
      };
    });
  };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
          technologies: [],
          githubUrl: "",
          liveDemoUrl: "",
        },
      ],
    }));
  };

  const removeProject = (index) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter(
        (_, projectIndex) =>
          projectIndex !== index
      ),
    }));
  };

  /* =========================================================
     CERTIFICATION CHANGE
  ========================================================= */

  const handleCertificationChange = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const certifications = [
        ...prev.certifications,
      ];

      certifications[index] = {
        ...certifications[index],
        [field]: value,
      };

      return {
        ...prev,
        certifications,
      };
    });
  };

  const addCertification = () => {
    setForm((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          issuer: "",
          issueDate: "",
          credentialUrl: "",
        },
      ],
    }));
  };

  const removeCertification = (index) => {
    setForm((prev) => ({
      ...prev,
      certifications:
        prev.certifications.filter(
          (_, certificationIndex) =>
            certificationIndex !== index
        ),
    }));
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = () => {
    setEditing(true);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {
    if (!profile) return;

    setForm({
      name: profile.name || "",
      mobile: profile.mobile || "",
      profilePhoto:
        profile.profilePhoto || "",
      linkedinProfile:
        profile.linkedinProfile || "",
      githubProfile:
        profile.githubProfile || "",

      education: {
        institution:
          profile.education?.institution || "",
        degree:
          profile.education?.degree || "",
        fieldOfStudy:
          profile.education?.fieldOfStudy || "",
        startYear:
          profile.education?.startYear || "",
        endYear:
          profile.education?.endYear || "",
      },

      skills:
        profile.skills?.join(", ") || "",
      interests:
        profile.interests?.join(", ") || "",
      careerGoals:
        profile.careerGoals?.join(", ") || "",
      achievements:
        profile.achievements?.join("\n") || "",
      contributions:
        profile.contributions?.join("\n") || "",

      projects: profile.projects || [],
      certifications:
        profile.certifications || [],
    });

    setEditing(false);
    setMessage("");
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editing) return;

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: form.name,
        mobile: form.mobile,
        profilePhoto: form.profilePhoto,
        linkedinProfile:
          form.linkedinProfile,
        githubProfile:
          form.githubProfile,

        education: {
          institution:
            form.education.institution,
          degree:
            form.education.degree,
          fieldOfStudy:
            form.education.fieldOfStudy,

          startYear: form.education.startYear
            ? Number(form.education.startYear)
            : undefined,

          endYear: form.education.endYear
            ? Number(form.education.endYear)
            : undefined,
        },

        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        interests: form.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        careerGoals: form.careerGoals
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        achievements: form.achievements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        contributions: form.contributions
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        projects: form.projects.map(
          (project) => ({
            title: project.title || "",
            description:
              project.description || "",

            technologies:
              Array.isArray(
                project.technologies
              )
                ? project.technologies
                : typeof project.technologies ===
                  "string"
                ? project.technologies
                    .split(",")
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean)
                : [],

            githubUrl:
              project.githubUrl || "",
            liveDemoUrl:
              project.liveDemoUrl || "",
          })
        ),

        certifications:
          form.certifications.map(
            (certification) => ({
              name:
                certification.name || "",
              issuer:
                certification.issuer || "",
              issueDate:
                certification.issueDate || "",
              credentialUrl:
                certification.credentialUrl ||
                "",
            })
          ),
      };

      const response = await api.put(
        "/profile",
        payload
      );

      setProfile(response.data.user);

      setMessage(
        "Profile saved successfully!"
      );

      setEditing(false);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     SCROLL DOWN
  ========================================================= */

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: "smooth",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-purple-200">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Loading your profile...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            !
          </div>

          <h2 className="text-xl font-black text-slate-900">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading
            your GradForge profile.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200"
          >
            Go to Dashboard
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP BRAND HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17163f] shadow-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* LOGO */}

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="transition hover:opacity-90"
          >
            <GradForgeLogo />
          </button>

          {/* RIGHT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="hidden rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:block"
            >
              Dashboard
            </button>

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 text-sm font-black text-white">

              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"
              )}

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section className="relative mb-7 overflow-hidden rounded-3xl bg-[#17163f] p-6 shadow-xl sm:p-8">

          {/* Background decoration */}

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              {/* PROFILE AVATAR */}

              <div className="relative shrink-0">

                <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-[2px] shadow-xl shadow-purple-950/30 sm:h-24 sm:w-24">

                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#242252] text-3xl font-black text-white">

                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt={
                          profile.name ||
                          "Profile"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "S"
                    )}

                  </div>

                </div>

                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-[#17163f] bg-emerald-400" />

              </div>

              {/* PROFILE INFO */}

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                  Student Profile
                </p>

                <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                  {profile.name ||
                    "Your Profile"}
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  {profile.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-violet-100">
                    {profile.role || "Student"}
                  </span>

                  {profile.education
                    ?.degree && (
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-300">
                      {
                        profile.education
                          .degree
                      }
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* EDIT BUTTON */}

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#17163f] shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                <span>✎</span>
                Edit Profile
              </button>
            )}

          </div>

        </section>

        {/* ===================================================
            STATUS MESSAGE
        =================================================== */}

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold ${
              message.includes("success")
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-indigo-200 bg-indigo-50 text-indigo-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* ===================================================
            PROFILE FORM
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              number="01"
              title="Basic Information"
              description="Your personal information and account details."
            />

            <div className="p-6 sm:p-7">

              <div className="grid gap-5 md:grid-cols-2">

                <ProfileField
                  label="Full Name"
                  value={form.name}
                  name="name"
                  onChange={handleChange}
                  disabled={!editing}
                />

                <ProfileField
                  label="Mobile"
                  value={form.mobile}
                  name="mobile"
                  onChange={handleChange}
                  disabled={!editing}
                />

                <ProfileField
                  label="Profile Photo URL"
                  value={form.profilePhoto}
                  name="profilePhoto"
                  placeholder="https://..."
                  onChange={handleChange}
                  disabled={!editing}
                  full
                />

                <ProfileField
                  label="Email"
                  value={profile.email}
                  disabled
                  muted
                />

                <ProfileField
                  label="Role"
                  value={profile.role}
                  disabled
                  muted
                />

              </div>

            </div>

          </section>

          {/* =================================================
              EDUCATION
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              number="02"
              title="Education"
              description="Build your academic background for your professional profile."
            />

            <div className="p-6 sm:p-7">

              <div className="grid gap-5 md:grid-cols-2">

                <EducationField
                  label="Institution"
                  name="institution"
                  value={
                    form.education
                      .institution
                  }
                  onChange={
                    handleEducationChange
                  }
                  disabled={!editing}
                />

                <EducationField
                  label="Degree"
                  name="degree"
                  value={
                    form.education.degree
                  }
                  onChange={
                    handleEducationChange
                  }
                  disabled={!editing}
                />

                <EducationField
                  label="Field of Study"
                  name="fieldOfStudy"
                  value={
                    form.education
                      .fieldOfStudy
                  }
                  onChange={
                    handleEducationChange
                  }
                  disabled={!editing}
                />

                <div className="grid grid-cols-2 gap-4">

                  <EducationField
                    label="Start Year"
                    name="startYear"
                    type="number"
                    value={
                      form.education
                        .startYear
                    }
                    onChange={
                      handleEducationChange
                    }
                    disabled={!editing}
                  />

                  <EducationField
                    label="End Year"
                    name="endYear"
                    type="number"
                    value={
                      form.education
                        .endYear
                    }
                    onChange={
                      handleEducationChange
                    }
                    disabled={!editing}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SKILLS & INTERESTS
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              number="03"
              title="Skills & Interests"
              description="Tell recruiters what you know and what you want to build."
            />

            <div className="space-y-5 p-6 sm:p-7">

              <ProfileField
                label="Skills"
                name="skills"
                value={form.skills}
                placeholder="JavaScript, React, Node.js, MongoDB"
                onChange={handleChange}
                disabled={!editing}
                helper="Separate skills with commas."
              />

              <ProfileField
                label="Interests"
                name="interests"
                value={form.interests}
                placeholder="Web Development, AI, Open Source"
                onChange={handleChange}
                disabled={!editing}
              />

              <ProfileField
                label="Career Goals"
                name="careerGoals"
                value={form.careerGoals}
                placeholder="Full Stack Developer, Software Engineer"
                onChange={handleChange}
                disabled={!editing}
              />

            </div>

          </section>

          {/* =================================================
              PROFESSIONAL PROFILES
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              number="04"
              title="Professional Profiles"
              description="Connect your professional and developer profiles."
            />

            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">

              <ProfileField
                label="GitHub"
                name="githubProfile"
                value={
                  form.githubProfile
                }
                placeholder="https://github.com/..."
                onChange={handleChange}
                disabled={!editing}
                icon="GH"
              />

              <ProfileField
                label="LinkedIn"
                name="linkedinProfile"
                value={
                  form.linkedinProfile
                }
                placeholder="https://linkedin.com/in/..."
                onChange={handleChange}
                disabled={!editing}
                icon="in"
              />

            </div>

          </section>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

              <SectionTitle
                number="05"
                title="Projects"
                description="Showcase your projects and technical work."
              />

              {editing && (
                <button
                  type="button"
                  onClick={addProject}
                  className="rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100"
                >
                  + Add Project
                </button>
              )}

            </div>

            <div className="p-6 sm:p-7">

              {form.projects.length ===
              0 ? (

                <EmptySection
                  icon="⌘"
                  title="No projects yet"
                  text="Add projects to showcase your technical experience."
                  button={
                    editing
                      ? "Add your first project"
                      : null
                  }
                  onClick={addProject}
                />

              ) : (

                <div className="space-y-5">

                  {form.projects.map(
                    (project, index) => (

                      <div
                        key={
                          project._id ||
                          index
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:border-indigo-200 hover:bg-white"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-black text-indigo-600">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <h3 className="font-bold text-slate-800">
                              Project{" "}
                              {index + 1}
                            </h3>

                          </div>

                          {editing && (
                            <button
                              type="button"
                              onClick={() =>
                                removeProject(
                                  index
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}

                        </div>

                        <div className="space-y-4">

                          <ProfileField
                            label="Project Title"
                            value={
                              project.title ||
                              ""
                            }
                            onChange={(e) =>
                              handleProjectChange(
                                index,
                                "title",
                                e.target
                                  .value
                              )
                            }
                            disabled={!editing}
                          />

                          <ProfileTextArea
                            label="Description"
                            value={
                              project.description ||
                              ""
                            }
                            onChange={(e) =>
                              handleProjectChange(
                                index,
                                "description",
                                e.target
                                  .value
                              )
                            }
                            disabled={!editing}
                            rows={4}
                          />

                          <ProfileField
                            label="Technologies"
                            value={
                              Array.isArray(
                                project.technologies
                              )
                                ? project.technologies.join(
                                    ", "
                                  )
                                : project.technologies ||
                                  ""
                            }
                            placeholder="React, Node.js, MongoDB"
                            onChange={(e) =>
                              handleProjectChange(
                                index,
                                "technologies",
                                e.target.value
                                  .split(",")
                                  .map(
                                    (
                                      item
                                    ) =>
                                      item.trim()
                                  )
                                  .filter(
                                    Boolean
                                  )
                              )
                            }
                            disabled={!editing}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">

                            <ProfileField
                              label="GitHub Repository"
                              value={
                                project.githubUrl ||
                                ""
                              }
                              placeholder="https://github.com/..."
                              onChange={(e) =>
                                handleProjectChange(
                                  index,
                                  "githubUrl",
                                  e.target
                                    .value
                                )
                              }
                              disabled={
                                !editing
                              }
                            />

                            <ProfileField
                              label="Live Demo"
                              value={
                                project.liveDemoUrl ||
                                ""
                              }
                              placeholder="https://..."
                              onChange={(e) =>
                                handleProjectChange(
                                  index,
                                  "liveDemoUrl",
                                  e.target
                                    .value
                                )
                              }
                              disabled={
                                !editing
                              }
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              CERTIFICATIONS
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

              <SectionTitle
                number="06"
                title="Certifications"
                description="Add certifications that strengthen your profile."
              />

              {editing && (
                <button
                  type="button"
                  onClick={addCertification}
                  className="rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100"
                >
                  + Add Certification
                </button>
              )}

            </div>

            <div className="p-6 sm:p-7">

              {form.certifications
                .length === 0 ? (

                <EmptySection
                  icon="✓"
                  title="No certifications yet"
                  text="Add your professional certifications and credentials."
                  button={
                    editing
                      ? "Add a certification"
                      : null
                  }
                  onClick={
                    addCertification
                  }
                />

              ) : (

                <div className="space-y-5">

                  {form.certifications.map(
                    (
                      certification,
                      index
                    ) => (

                      <div
                        key={
                          certification._id ||
                          index
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:border-indigo-200 hover:bg-white"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-600">
                              ✓
                            </div>

                            <h3 className="font-bold text-slate-800">
                              Certification{" "}
                              {index + 1}
                            </h3>

                          </div>

                          {editing && (
                            <button
                              type="button"
                              onClick={() =>
                                removeCertification(
                                  index
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}

                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">

                          <ProfileField
                            label="Certification Name"
                            value={
                              certification.name ||
                              ""
                            }
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "name",
                                e.target
                                  .value
                              )
                            }
                            disabled={!editing}
                          />

                          <ProfileField
                            label="Issuing Organization"
                            value={
                              certification.issuer ||
                              ""
                            }
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "issuer",
                                e.target
                                  .value
                              )
                            }
                            disabled={!editing}
                          />

                          <ProfileField
                            label="Issue Date"
                            value={
                              certification.issueDate ||
                              ""
                            }
                            placeholder="September 2026"
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "issueDate",
                                e.target
                                  .value
                              )
                            }
                            disabled={!editing}
                          />

                          <ProfileField
                            label="Credential URL"
                            value={
                              certification.credentialUrl ||
                              ""
                            }
                            placeholder="https://..."
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "credentialUrl",
                                e.target
                                  .value
                              )
                            }
                            disabled={!editing}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              ACHIEVEMENTS
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              number="07"
              title="Achievements & Contributions"
              description="Highlight accomplishments and contributions that represent your journey."
            />

            <div className="space-y-5 p-6 sm:p-7">

              <ProfileTextArea
                label="Achievements"
                name="achievements"
                value={form.achievements}
                placeholder={
                  "Won college hackathon\nCompleted 100 coding problems"
                }
                onChange={handleChange}
                disabled={!editing}
                rows={5}
              />

              <ProfileTextArea
                label="Contributions"
                name="contributions"
                value={form.contributions}
                placeholder={
                  "Open source contribution\nCollege technical community"
                }
                onChange={handleChange}
                disabled={!editing}
                rows={5}
              />

            </div>

          </section>

          {/* =================================================
              ACTION BAR
          ================================================= */}

          <div className="sticky bottom-4 z-30 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                {message ? (
                  <p
                    className={`text-sm font-bold ${
                      message.includes(
                        "success"
                      )
                        ? "text-emerald-600"
                        : "text-indigo-600"
                    }`}
                  >
                    {message}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    {editing
                      ? "You are editing your profile."
                      : "Your profile is currently read-only."}
                  </p>
                )}

              </div>

              <div className="flex flex-wrap gap-3">

                {/* DASHBOARD */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Dashboard
                </button>

                {/* CANCEL */}

                {editing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}

                {/* EDIT */}

                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700"
                  >
                    Edit Profile
                  </button>
                )}

                {/* SAVE */}

                {editing && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                )}

              </div>

            </div>

          </div>

        </form>

      </main>

      {/* =====================================================
          SCROLL BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={scrollDown}
        aria-label="Scroll down"
        className="fixed bottom-6 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-1 hover:shadow-xl"
      >
        ↓
      </button>

    </div>
  );
};

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const SectionHeader = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="border-b border-slate-100 p-6 sm:p-7">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-xs font-black text-indigo-600">
          {number}
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

      </div>

    </div>
  );
};

const SectionTitle = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-xs font-black text-indigo-600">
        {number}
      </div>

      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
};

const ProfileField = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  helper = "",
  muted = false,
  full = false,
  icon = "",
}) => {
  return (
    <div className={full ? "md:col-span-2" : ""}>

      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {icon && (
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500">
            {icon}
          </span>
        )}

        {label}
      </label>

      <input
        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition ${
          disabled
            ? muted
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
              : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        }`}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />

      {helper && (
        <p className="mt-2 text-xs text-slate-400">
          {helper}
        </p>
      )}

    </div>
  );
};

const EducationField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
}) => {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <input
        type={type}
        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        }`}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
      />

    </div>
  );
};

const ProfileTextArea = ({
  label,
  name,
  value,
  onChange,
  disabled,
  placeholder,
  rows = 5,
}) => {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <textarea
        name={name}
        rows={rows}
        className={`w-full resize-y rounded-xl border px-4 py-3 text-sm font-medium leading-6 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        }`}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />

    </div>
  );
};

const EmptySection = ({
  icon,
  title,
  text,
  button,
  onClick,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">

      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-black text-indigo-600">
        {icon}
      </div>

      <h3 className="font-bold text-slate-800">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>

      {button && (
        <button
          type="button"
          onClick={onClick}
          className="mt-4 text-sm font-bold text-indigo-600 transition hover:text-violet-600"
        >
          {button} →
        </button>
      )}

    </div>
  );
};

export default Profile;