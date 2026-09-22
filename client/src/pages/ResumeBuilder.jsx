import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const THEMES = {
  classic: {
    name: "Classic",
    accent: "#111827",
    label: "Traditional ATS",
    font: "Arial, Helvetica, sans-serif",
    headingFont: "Arial, Helvetica, sans-serif",
    paper: "#ffffff",
  },
  modern: {
    name: "Modern",
    accent: "#4f46e5",
    label: "Contemporary",
    font: "Inter, Arial, sans-serif",
    headingFont: "Inter, Arial, sans-serif",
    paper: "#ffffff",
  },
  emerald: {
    name: "Technical",
    accent: "#047857",
    label: "Technical sidebar",
    font: "Inter, Arial, sans-serif",
    headingFont: "Inter, Arial, sans-serif",
    paper: "#fbfffd",
  },
  executive: {
    name: "Executive",
    accent: "#7c2d12",
    label: "Editorial",
    font: "Georgia, 'Times New Roman', serif",
    headingFont: "Georgia, 'Times New Roman', serif",
    paper: "#fffdf8",
  },
};

const emptyEducation = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
};

const emptyProject = {
  title: "",
  description: "",
  technologies: [],
  githubUrl: "",
  liveDemoUrl: "",
};

const emptyExperience = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyCertification = {
  name: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
};

const emptyResume = {
  personal: {
    name: "",
    email: "",
    mobile: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
};

function GradForgeLogo() {
  return (
    <div className="rb-logo">
      <div className="rb-logo-mark">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path d="M3 8.5L12 4L21 8.5L12 13L3 8.5Z" fill="white" />
          <path
            d="M6 10.2V15.2C6 15.2 8.2 18 12 18C15.8 18 18 15.2 18 15.2V10.2"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M21 9V14"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <div className="rb-logo-name">GradForge</div>
        <div className="rb-logo-sub">FORGE YOUR FUTURE</div>
      </div>
    </div>
  );
}

function cleanArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeResume(data) {
  return {
    personal: {
      ...emptyResume.personal,
      ...(data?.personal || {}),
    },
    education: cleanArray(data?.education),
    skills: cleanArray(data?.skills),
    projects: cleanArray(data?.projects).map((p) => ({
      ...emptyProject,
      ...p,
      technologies: cleanArray(p?.technologies),
    })),
    experience: cleanArray(data?.experience),
    certifications: cleanArray(data?.certifications),
    achievements: cleanArray(data?.achievements),
  };
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(emptyResume);
  const [theme, setTheme] = useState("modern");
  const [activeSection, setActiveSection] = useState("personal");
  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [technologyInputs, setTechnologyInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/resumes/me");
      setResume(normalizeResume(data));
    } catch (error) {
      console.error("Resume loading failed:", error);
      setMessage("Unable to load your resume.");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      setSaving(true);
      setMessage("");
      await api.put("/resumes/me", resume);
      setMessage("Resume saved successfully.");
    } catch (error) {
      console.error("Resume save failed:", error);
      setMessage("Could not save your resume.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updatePersonal = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResume((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [section]: next };
    });
  };

  const addItem = (section, template) => {
    setResume((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...template }],
    }));
  };

  const removeItem = (section, index) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (
      !resume.skills.some(
        (skill) => skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      setResume((prev) => ({
        ...prev,
        skills: [...prev.skills, value],
      }));
    }
    setSkillInput("");
  };

  const addAchievement = () => {
    const value = achievementInput.trim();
    if (!value) return;
    setResume((prev) => ({
      ...prev,
      achievements: [...prev.achievements, value],
    }));
    setAchievementInput("");
  };

  const addTechnology = (index) => {
    const value = (technologyInputs[index] || "").trim();
    if (!value) return;

    setResume((prev) => {
      const projects = [...prev.projects];
      const current = cleanArray(projects[index].technologies);
      if (
        !current.some(
          (tech) => tech.toLowerCase() === value.toLowerCase()
        )
      ) {
        projects[index] = {
          ...projects[index],
          technologies: [...current, value],
        };
      }
      return { ...prev, projects };
    });

    setTechnologyInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const removeChip = (section, index, chipIndex) => {
    setResume((prev) => {
      const items = [...prev[section]];
      const chips = [...items[index].technologies];
      chips.splice(chipIndex, 1);
      items[index] = { ...items[index], technologies: chips };
      return { ...prev, [section]: items };
    });
  };

  const removeSkill = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const removeAchievement = (index) => {
    setResume((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const completion = useMemo(() => {
    const checks = [
      Boolean(resume.personal.name),
      Boolean(resume.personal.email),
      Boolean(resume.personal.summary),
      resume.skills.length > 0,
      resume.education.length > 0,
      resume.projects.length > 0,
      resume.experience.length > 0,
      resume.certifications.length > 0,
      resume.achievements.length > 0,
    ];
    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [resume]);

  const printPdf = () => {
    window.print();
  };

  const downloadDoc = () => {
    const root = document.getElementById("resume-document");
    if (!root) return;

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; color:#111827; margin:0; }
        .resume-paper { width: 794px; margin:auto; padding:42px; box-sizing:border-box; }
        .resume-header { border-bottom:2px solid ${THEMES[theme].accent}; padding-bottom:16px; }
        h1 { margin:0 0 6px; font-size:28px; }
        h2 { font-size:13px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #ddd; padding-bottom:5px; margin-top:22px; }
        h3 { margin:8px 0 2px; font-size:13px; }
        p, li { font-size:11px; line-height:1.55; }
        .muted { color:#64748b; }
        .resume-contact { font-size:10px; color:#475569; }
        ul { padding-left:18px; }
        a { color:${THEMES[theme].accent}; }
      </style>
    `;

    const html = `
      <!doctype html>
      <html>
        <head><meta charset="utf-8">${styles}</head>
        <body>${root.innerHTML}</body>
      </html>
    `;

    const blob = new Blob([html], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resume.personal.name || "GradForge-Resume"}.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="rb-loading">
        <div className="rb-spinner" />
        Loading your resume...
      </div>
    );
  }

  const accent = THEMES[theme].accent;

  return (
    <>
      <style>{`
        * { box-sizing:border-box; }
        body {
          margin:0;
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
          background:#f5f7fb;
          color:#111827;
        }
        button,input,textarea,select { font:inherit; }
        button { cursor:pointer; }

        .rb-page { min-height:100vh; }
        .rb-navbar {
          min-height:70px;
          background:rgba(255,255,255,.97);
          border-bottom:1px solid #e5e7eb;
          display:grid;
          grid-template-columns:1fr auto 1fr;
          align-items:center;
          gap:16px;
          padding:0 28px;
          position:sticky;
          top:0;
          z-index:30;
          backdrop-filter:blur(16px);
        }
        .rb-nav-left { justify-self:start; min-width:0; }
        .rb-nav-center {
          justify-self:center;
          font-size:13px;
          color:#64748b;
          font-weight:750;
          white-space:nowrap;
        }
        .rb-nav-right { justify-self:end; }
        .rb-dashboard-btn {
          border:1px solid #dbe1ea;
          background:#fff;
          color:#1e293b;
          border-radius:11px;
          padding:9px 14px;
          font-size:12px;
          font-weight:850;
          white-space:nowrap;
          transition:.18s ease;
        }
        .rb-dashboard-btn:hover {
          border-color:#a5b4fc;
          background:#eef2ff;
          color:#4338ca;
          transform:translateY(-1px);
        }
        .rb-logo { display:flex;align-items:center;gap:10px; }
        .rb-logo-mark {
          width:40px;height:40px;border-radius:11px;
          display:grid;place-items:center;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          box-shadow:0 7px 18px rgba(79,70,229,.22);
        }
        .rb-logo-name { font-size:18px;font-weight:850;letter-spacing:-.4px; }
        .rb-logo-sub { font-size:8px;font-weight:800;letter-spacing:1.4px;color:#6b7280; }
        .rb-nav-title { font-size:13px;color:#64748b;font-weight:700; }

        .rb-layout {
          max-width:1500px;
          margin:auto;
          padding:24px;
          display:grid;
          grid-template-columns:270px minmax(0,1fr) 540px;
          gap:20px;
          align-items:start;
        }

        .rb-sidebar,.rb-editor,.rb-preview-wrap {
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:18px;
          box-shadow:0 8px 28px rgba(15,23,42,.045);
        }

        .rb-sidebar { padding:18px;position:sticky;top:94px; }
        .rb-side-title { font-size:15px;font-weight:850;margin-bottom:4px; }
        .rb-side-sub { font-size:11px;color:#64748b;line-height:1.5;margin-bottom:18px; }

        .rb-progress {
          background:#f1f5f9;border-radius:999px;height:7px;overflow:hidden;margin:8px 0 6px;
        }
        .rb-progress > div { height:100%;background:#4f46e5;border-radius:999px;transition:.25s; }
        .rb-progress-text { font-size:10px;color:#64748b;margin-bottom:18px; }

        .rb-section-btn {
          width:100%;border:0;background:transparent;text-align:left;
          padding:11px 12px;border-radius:10px;color:#64748b;font-size:12px;
          font-weight:750;margin-bottom:4px;
        }
        .rb-section-btn:hover { background:#f8fafc;color:#111827; }
        .rb-section-btn.active { background:#eef2ff;color:#4338ca; }

        .rb-sidebar-actions { border-top:1px solid #eef2f7;margin-top:14px;padding-top:14px;display:grid;gap:8px; }
        .rb-save,.rb-download {
          border:0;border-radius:10px;padding:11px 12px;font-size:11px;font-weight:800;
        }
        .rb-save { background:#4f46e5;color:#fff; }
        .rb-save:hover { background:#4338ca; }
        .rb-download { background:#f8fafc;color:#374151;border:1px solid #e2e8f0; }
        .rb-download:hover { border-color:#a5b4fc;color:#4338ca; }
        .rb-message { font-size:10px;color:#047857;line-height:1.4;margin-top:9px; }

        .rb-editor { padding:24px; }
        .rb-editor-head { display:flex;justify-content:space-between;gap:15px;align-items:flex-start;margin-bottom:22px; }
        .rb-editor h1 { margin:0;font-size:23px;letter-spacing:-.7px; }
        .rb-editor-head p { margin:5px 0 0;color:#64748b;font-size:11px; }
        .rb-theme-mini {
          font-size:10px;font-weight:800;padding:7px 9px;border-radius:8px;
          background:#f8fafc;color:#64748b;white-space:nowrap;
        }

        .rb-form-title { font-size:16px;font-weight:850;margin:0 0 15px; }
        .rb-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px; }
        .rb-field { display:flex;flex-direction:column;gap:6px; }
        .rb-field.full { grid-column:1/-1; }
        .rb-field label { font-size:10px;font-weight:800;color:#475569; }
        .rb-field input,.rb-field textarea,.rb-field select {
          width:100%;border:1px solid #dbe1ea;border-radius:9px;padding:10px 11px;
          outline:none;background:#fff;font-size:11px;color:#111827;
        }
        .rb-field textarea { min-height:90px;resize:vertical;line-height:1.5; }
        .rb-field input:focus,.rb-field textarea:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.08); }

        .rb-card {
          border:1px solid #e5e7eb;border-radius:13px;padding:15px;margin-bottom:12px;background:#fff;
        }
        .rb-card-head { display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px; }
        .rb-card-head strong { font-size:12px; }
        .rb-remove { border:0;background:#fef2f2;color:#dc2626;border-radius:7px;padding:6px 8px;font-size:10px;font-weight:800; }
        .rb-add {
          border:1px dashed #c7d2fe;background:#f8f7ff;color:#4338ca;
          border-radius:10px;padding:10px 12px;font-size:11px;font-weight:800;width:100%;
        }

        .rb-chips { display:flex;flex-wrap:wrap;gap:6px;margin-top:9px; }
        .rb-chip { background:#eef2ff;color:#4338ca;border-radius:7px;padding:6px 8px;font-size:9px;font-weight:750; }
        .rb-chip button { border:0;background:none;color:inherit;margin-left:5px;padding:0;font-weight:900; }
        .rb-inline { display:flex;gap:7px; }
        .rb-inline input { flex:1; }

        .rb-preview-wrap {
          padding:14px;
          position:sticky;
          top:94px;
          background:#eef1f6;
        }
        .rb-preview-toolbar {
          display:flex;align-items:center;justify-content:space-between;gap:10px;
          margin-bottom:11px;padding:0 3px;
        }
        .rb-preview-label { font-size:11px;font-weight:850;color:#475569; }
        .rb-theme-picker { display:flex;gap:5px; }
        .rb-theme-btn {
          border:1px solid #dbe1ea;background:#fff;border-radius:7px;
          padding:6px 8px;font-size:9px;font-weight:750;color:#64748b;
        }
        .rb-theme-btn.active { color:#fff;border-color:transparent;background:#4f46e5; }
        .rb-theme-btn { display:inline-flex;align-items:center;gap:5px; }
        .theme-swatch { width:7px;height:7px;border-radius:50%;background:#111827; }
        .theme-option-modern .theme-swatch { background:#4f46e5; }
        .theme-option-emerald .theme-swatch { background:#047857; }
        .theme-option-executive .theme-swatch { background:#7c2d12; }

        .resume-paper {
          width:100%;
          max-width:794px;
          min-height:1123px;
          margin:auto;
          background:#fff;
          padding:42px 45px;
          color:#111827;
          box-shadow:0 12px 35px rgba(15,23,42,.13);
          font-family:Arial,Helvetica,sans-serif;
        }
        .resume-header { padding-bottom:15px;border-bottom:2px solid var(--resume-accent); }
        .resume-name { margin:0;font-size:29px;line-height:1.1;font-weight:850;letter-spacing:-.7px; }
        .resume-role { color:var(--resume-accent);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px;margin-top:6px; }
        .resume-contact { display:flex;flex-wrap:wrap;gap:5px 12px;color:#475569;font-size:9px;margin-top:10px; }
        .resume-contact a { color:inherit;text-decoration:none; }
        .resume-section { margin-top:19px; }
        .resume-section-title {
          color:var(--resume-accent);font-size:10px;font-weight:900;
          letter-spacing:1.3px;text-transform:uppercase;
          padding-bottom:5px;border-bottom:1px solid #e5e7eb;margin-bottom:9px;
        }
        .resume-summary { color:#374151;font-size:10px;line-height:1.65;margin:0; }
        .resume-entry { margin-bottom:11px; }
        .resume-entry:last-child { margin-bottom:0; }
        .resume-entry-top { display:flex;justify-content:space-between;gap:10px; }
        .resume-entry-title { font-size:11px;font-weight:850;margin:0; }
        .resume-entry-meta { color:#64748b;font-size:9px;text-align:right; }
        .resume-entry-sub { color:var(--resume-accent);font-size:9px;font-weight:750;margin-top:2px; }
        .resume-entry-desc { color:#374151;font-size:9px;line-height:1.55;margin:4px 0 0;white-space:pre-wrap; }
        .resume-tags { display:flex;flex-wrap:wrap;gap:4px;margin-top:5px; }
        .resume-tag { font-size:8px;padding:3px 5px;background:#f1f5f9;color:#475569;border-radius:4px; }
        .resume-list { margin:0;padding-left:15px; }
        .resume-list li { color:#374151;font-size:9px;line-height:1.55;margin-bottom:3px; }


        /* ---------- Resume theme identities ---------- */

        .resume-paper {
          background:var(--resume-paper);
          font-family:var(--resume-font);
          transition:.2s ease;
        }

        /* Classic: clean ATS, no decoration */
        .resume-paper.theme-classic {
          border-radius:0;
          box-shadow:0 10px 28px rgba(15,23,42,.10);
        }
        .resume-paper.theme-classic .resume-header {
          border-bottom:2px solid #111827;
        }
        .resume-paper.theme-classic .resume-section-title {
          color:#111827;
          border-bottom:1px solid #cbd5e1;
          letter-spacing:1px;
        }
        .resume-paper.theme-classic .resume-tag {
          background:#f8fafc;
          color:#334155;
          border:1px solid #e2e8f0;
          border-radius:2px;
        }

        /* Modern: strong indigo top bar + pill tags + accent section markers */
        .resume-paper.theme-modern {
          border-top:8px solid #4f46e5;
          border-radius:10px;
        }
        .resume-paper.theme-modern .resume-header {
          border-bottom:0;
          padding-bottom:20px;
        }
        .resume-paper.theme-modern .resume-name {
          font-size:31px;
          letter-spacing:-1px;
        }
        .resume-paper.theme-modern .resume-section-title {
          display:flex;
          align-items:center;
          gap:8px;
          border-bottom:0;
          padding-bottom:5px;
        }
        .resume-paper.theme-modern .resume-section-title::before {
          content:"";
          width:24px;
          height:4px;
          border-radius:99px;
          background:#4f46e5;
        }
        .resume-paper.theme-modern .resume-tag {
          background:#eef2ff;
          color:#4338ca;
          border-radius:999px;
        }

        /* Technical: green left rail + boxed technical sections */
        .resume-paper.theme-emerald {
          border-left:8px solid #047857;
          border-radius:4px;
          padding-left:38px;
        }
        .resume-paper.theme-emerald .resume-header {
          border-bottom:1px solid #a7f3d0;
        }
        .resume-paper.theme-emerald .resume-section-title {
          color:#047857;
          background:#ecfdf5;
          border-bottom:0;
          border-left:4px solid #047857;
          padding:5px 8px;
        }
        .resume-paper.theme-emerald .resume-tag {
          background:#ecfdf5;
          color:#047857;
          border-radius:3px;
        }

        /* Executive: centered serif editorial resume */
        .resume-paper.theme-executive {
          border-top:1px solid #7c2d12;
          border-bottom:1px solid #7c2d12;
          border-radius:0;
          padding:50px 52px;
        }
        .resume-paper.theme-executive .resume-header {
          text-align:center;
          border-bottom:1px solid #c4b5a5;
          padding-bottom:22px;
        }
        .resume-paper.theme-executive .resume-name {
          font-family:Georgia,"Times New Roman",serif;
          font-size:34px;
          font-weight:700;
          letter-spacing:.2px;
        }
        .resume-paper.theme-executive .resume-role {
          letter-spacing:2px;
          font-family:Arial,sans-serif;
        }
        .resume-paper.theme-executive .resume-contact {
          justify-content:center;
          font-family:Arial,sans-serif;
        }
        .resume-paper.theme-executive .resume-section-title {
          color:#7c2d12;
          border-bottom:0;
          text-align:center;
          letter-spacing:2px;
          font-family:Georgia,"Times New Roman",serif;
        }
        .resume-paper.theme-executive .resume-entry-title {
          font-family:Georgia,"Times New Roman",serif;
          font-weight:700;
        }

        .rb-empty { color:#94a3b8;font-size:9px;font-style:italic; }
        .rb-loading { min-height:100vh;display:grid;place-items:center;color:#64748b;font-size:13px; }
        .rb-spinner { width:25px;height:25px;border:3px solid #e5e7eb;border-top-color:#4f46e5;border-radius:50%;animation:spin .8s linear infinite;margin-right:10px; }
        @keyframes spin { to { transform:rotate(360deg); } }

        @media(max-width:1200px) {
          .rb-layout { grid-template-columns:230px minmax(0,1fr); }
          .rb-preview-wrap { grid-column:1/-1;position:static; }
          .resume-paper { max-width:794px; }
        }
        @media(max-width:760px) {
          .rb-navbar {
            grid-template-columns:1fr auto;
            padding:0 14px;
          }
          .rb-nav-center { display:none; }
          .rb-nav-right { justify-self:end; }
          .rb-dashboard-btn { padding:8px 10px; }
          .rb-navbar .rb-logo-name { font-size:16px; }
          .rb-navbar .rb-logo-sub { display:none; }
          .rb-layout { display:block;padding:14px; }
          .rb-sidebar,.rb-preview-wrap { position:static;margin-bottom:14px; }
          .rb-sidebar { display:none; }
          .rb-grid { grid-template-columns:1fr; }
          .rb-field.full { grid-column:auto; }
          .rb-editor { padding:17px; }
          .resume-paper { padding:30px 25px;min-height:auto; }
        }

        @media print {
          body { background:#fff !important; }
          .rb-navbar,.rb-sidebar,.rb-editor,.rb-preview-toolbar { display:none !important; }
          .rb-layout { display:block !important;padding:0 !important; }
          .rb-preview-wrap { display:block !important;border:0 !important;padding:0 !important;background:#fff !important;box-shadow:none !important; }
          .resume-paper { box-shadow:none !important;margin:0 !important;width:210mm !important;min-height:297mm !important;max-width:none !important;padding:14mm !important; }
          @page { size:A4;margin:0; }
        }
      `}</style>

      <div className="rb-page">
        <header className="rb-navbar">
          <div className="rb-nav-left">
            <GradForgeLogo />
          </div>
          <div className="rb-nav-center">Professional Resume Builder</div>
          <div className="rb-nav-right">
            <button
              type="button"
              className="rb-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </div>
        </header>

        <main className="rb-layout">
          <aside className="rb-sidebar">
            <div className="rb-side-title">Resume Sections</div>
            <div className="rb-side-sub">
              Build a focused, recruiter-friendly resume.
            </div>

            <div className="rb-progress">
              <div style={{ width: `${completion}%` }} />
            </div>
            <div className="rb-progress-text">
              {completion}% profile complete
            </div>

            {[
              ["personal", "Personal Details"],
              ["education", "Education"],
              ["skills", "Skills"],
              ["projects", "Projects"],
              ["experience", "Experience"],
              ["certifications", "Certifications"],
              ["achievements", "Achievements"],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                className={`rb-section-btn ${
                  activeSection === id ? "active" : ""
                }`}
                onClick={() => setActiveSection(id)}
              >
                {label}
              </button>
            ))}

            <div className="rb-sidebar-actions">
              <button
                type="button"
                className="rb-save"
                onClick={saveResume}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Resume"}
              </button>
              <button type="button" className="rb-download" onClick={printPdf}>
                Download PDF
              </button>
              <button type="button" className="rb-download" onClick={downloadDoc}>
                Download Word (.doc)
              </button>
              {message && <div className="rb-message">{message}</div>}
            </div>
          </aside>

          <section className="rb-editor">
            <div className="rb-editor-head">
              <div>
                <h1>Build your resume</h1>
                <p>
                  Keep it concise, achievement-focused and easy for recruiters
                  to scan.
                </p>
              </div>
              <div className="rb-theme-mini">
                {THEMES[theme].name} · {THEMES[theme].label}
              </div>
            </div>

            {activeSection === "personal" && (
              <>
                <h2 className="rb-form-title">Personal Details</h2>
                <div className="rb-grid">
                  {[
                    ["name", "Full Name", "Your name"],
                    ["email", "Email", "you@example.com"],
                    ["mobile", "Mobile", "+91..."],
                    ["location", "Location", "Hyderabad, India"],
                    ["linkedin", "LinkedIn", "https://linkedin.com/in/..."],
                    ["github", "GitHub", "https://github.com/..."],
                  ].map(([field, label, placeholder]) => (
                    <div className="rb-field" key={field}>
                      <label>{label}</label>
                      <input
                        value={resume.personal[field]}
                        placeholder={placeholder}
                        onChange={(e) =>
                          updatePersonal(field, e.target.value)
                        }
                      />
                    </div>
                  ))}

                  <div className="rb-field full">
                    <label>Professional Summary</label>
                    <textarea
                      value={resume.personal.summary}
                      placeholder="2–4 lines describing your profile, strongest skills and career direction."
                      onChange={(e) =>
                        updatePersonal("summary", e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {activeSection === "education" && (
              <>
                <h2 className="rb-form-title">Education</h2>
                {resume.education.map((item, index) => (
                  <div className="rb-card" key={index}>
                    <div className="rb-card-head">
                      <strong>Education {index + 1}</strong>
                      <button
                        type="button"
                        className="rb-remove"
                        onClick={() => removeItem("education", index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="rb-grid">
                      {[
                        ["institution", "Institution"],
                        ["degree", "Degree"],
                        ["fieldOfStudy", "Field of Study"],
                        ["startYear", "Start Year"],
                        ["endYear", "End Year"],
                      ].map(([field, label]) => (
                        <div className="rb-field" key={field}>
                          <label>{label}</label>
                          <input
                            value={item[field] || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "education",
                                index,
                                field,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="rb-add"
                  onClick={() => addItem("education", emptyEducation)}
                >
                  + Add Education
                </button>
              </>
            )}

            {activeSection === "skills" && (
              <>
                <h2 className="rb-form-title">Technical Skills</h2>
                <div className="rb-inline">
                  <input
                    className="rb-field"
                    value={skillInput}
                    placeholder="React, Node.js, AWS..."
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button type="button" className="rb-save" onClick={addSkill}>
                    Add
                  </button>
                </div>

                <div className="rb-chips">
                  {resume.skills.map((skill, index) => (
                    <span className="rb-chip" key={`${skill}-${index}`}>
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}

            {activeSection === "projects" && (
              <>
                <h2 className="rb-form-title">Projects</h2>
                {resume.projects.map((item, index) => (
                  <div className="rb-card" key={index}>
                    <div className="rb-card-head">
                      <strong>Project {index + 1}</strong>
                      <button
                        type="button"
                        className="rb-remove"
                        onClick={() => removeItem("projects", index)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="rb-grid">
                      <div className="rb-field full">
                        <label>Project Title</label>
                        <input
                          value={item.title || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "projects",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="rb-field full">
                        <label>Description</label>
                        <textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "projects",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="rb-field">
                        <label>GitHub URL</label>
                        <input
                          value={item.githubUrl || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "projects",
                              index,
                              "githubUrl",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="rb-field">
                        <label>Live Demo URL</label>
                        <input
                          value={item.liveDemoUrl || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "projects",
                              index,
                              "liveDemoUrl",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="rb-field full">
                        <label>Technologies</label>
                        <div className="rb-inline">
                          <input
                            value={technologyInputs[index] || ""}
                            placeholder="React, MongoDB..."
                            onChange={(e) =>
                              setTechnologyInputs((prev) => ({
                                ...prev,
                                [index]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTechnology(index);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="rb-save"
                            onClick={() => addTechnology(index)}
                          >
                            Add
                          </button>
                        </div>
                        <div className="rb-chips">
                          {cleanArray(item.technologies).map(
                            (technology, chipIndex) => (
                              <span
                                className="rb-chip"
                                key={`${technology}-${chipIndex}`}
                              >
                                {technology}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeChip(
                                      "projects",
                                      index,
                                      chipIndex
                                    )
                                  }
                                >
                                  ×
                                </button>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="rb-add"
                  onClick={() => addItem("projects", emptyProject)}
                >
                  + Add Project
                </button>
              </>
            )}

            {activeSection === "experience" && (
              <>
                <h2 className="rb-form-title">Experience</h2>
                {resume.experience.map((item, index) => (
                  <div className="rb-card" key={index}>
                    <div className="rb-card-head">
                      <strong>Experience {index + 1}</strong>
                      <button
                        type="button"
                        className="rb-remove"
                        onClick={() => removeItem("experience", index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="rb-grid">
                      {[
                        ["company", "Company"],
                        ["role", "Role"],
                        ["startDate", "Start Date"],
                        ["endDate", "End Date"],
                      ].map(([field, label]) => (
                        <div className="rb-field" key={field}>
                          <label>{label}</label>
                          <input
                            value={item[field] || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "experience",
                                index,
                                field,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                      <div className="rb-field full">
                        <label>Description</label>
                        <textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "experience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="rb-add"
                  onClick={() => addItem("experience", emptyExperience)}
                >
                  + Add Experience
                </button>
              </>
            )}

            {activeSection === "certifications" && (
              <>
                <h2 className="rb-form-title">Certifications</h2>
                {resume.certifications.map((item, index) => (
                  <div className="rb-card" key={index}>
                    <div className="rb-card-head">
                      <strong>Certification {index + 1}</strong>
                      <button
                        type="button"
                        className="rb-remove"
                        onClick={() => removeItem("certifications", index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="rb-grid">
                      {[
                        ["name", "Certification Name"],
                        ["issuer", "Issuer"],
                        ["issueDate", "Issue Date"],
                        ["credentialUrl", "Credential URL"],
                      ].map(([field, label]) => (
                        <div className="rb-field" key={field}>
                          <label>{label}</label>
                          <input
                            value={item[field] || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "certifications",
                                index,
                                field,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="rb-add"
                  onClick={() =>
                    addItem("certifications", emptyCertification)
                  }
                >
                  + Add Certification
                </button>
              </>
            )}

            {activeSection === "achievements" && (
              <>
                <h2 className="rb-form-title">Achievements</h2>
                <div className="rb-inline">
                  <input
                    value={achievementInput}
                    placeholder="Won a hackathon, solved 300+ DSA problems..."
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAchievement();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="rb-save"
                    onClick={addAchievement}
                  >
                    Add
                  </button>
                </div>

                <div className="rb-chips">
                  {resume.achievements.map((achievement, index) => (
                    <span className="rb-chip" key={`${achievement}-${index}`}>
                      {achievement}
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="rb-preview-wrap">
            <div className="rb-preview-toolbar">
              <span className="rb-preview-label">LIVE A4 PREVIEW</span>
              <div className="rb-theme-picker">
                {Object.entries(THEMES).map(([key, item]) => (
                  <button
                    type="button"
                    key={key}
                    className={`rb-theme-btn ${
                      theme === key ? "active" : ""
                    }`}
                    onClick={() => setTheme(key)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div
              id="resume-document"
              className={`resume-paper theme-${theme}`}
              style={{
                "--resume-accent": accent,
                "--resume-paper": THEMES[theme].paper,
                "--resume-font": THEMES[theme].font,
                "--resume-heading-font": THEMES[theme].headingFont,
              }}
            >
              <div className="resume-header">
                <h1 className="resume-name">
                  {resume.personal.name || "Your Name"}
                </h1>
                <div className="resume-role">
                  {resume.personal.summary
                    ? "Software Developer"
                    : "Professional Resume"}
                </div>

                <div className="resume-contact">
                  {resume.personal.email && (
                    <span>{resume.personal.email}</span>
                  )}
                  {resume.personal.mobile && (
                    <span>{resume.personal.mobile}</span>
                  )}
                  {resume.personal.location && (
                    <span>{resume.personal.location}</span>
                  )}
                  {resume.personal.linkedin && (
                    <a
                      href={resume.personal.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {resume.personal.github && (
                    <a
                      href={resume.personal.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              {resume.personal.summary && (
                <section className="resume-section">
                  <div className="resume-section-title">Profile</div>
                  <p className="resume-summary">
                    {resume.personal.summary}
                  </p>
                </section>
              )}

              {resume.skills.length > 0 && (
                <section className="resume-section">
                  <div className="resume-section-title">Skills</div>
                  <div className="resume-tags">
                    {resume.skills.map((skill, index) => (
                      <span className="resume-tag" key={index}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {resume.experience.length > 0 && (
                <section className="resume-section">
                  <div className="resume-section-title">Experience</div>
                  {resume.experience.map((item, index) => (
                    <div className="resume-entry" key={index}>
                      <div className="resume-entry-top">
                        <div>
                          <div className="resume-entry-title">
                            {item.role || "Role"}
                          </div>
                          <div className="resume-entry-sub">
                            {item.company}
                          </div>
                        </div>
                        <div className="resume-entry-meta">
                          {item.startDate}
                          {item.endDate ? ` – ${item.endDate}` : ""}
                        </div>
                      </div>
                      {item.description && (
                        <p className="resume-entry-desc">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {resume.projects.length > 0 && (
                <section className="resume-section">
                  <div className="resume-section-title">Projects</div>
                  {resume.projects.map((item, index) => (
                    <div className="resume-entry" key={index}>
                      <div className="resume-entry-title">
                        {item.title || "Project"}
                      </div>
                      {item.description && (
                        <p className="resume-entry-desc">
                          {item.description}
                        </p>
                      )}
                      {item.technologies?.length > 0 && (
                        <div className="resume-tags">
                          {item.technologies.map((tech, i) => (
                            <span className="resume-tag" key={i}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {resume.education.length > 0 && (
                <section className="resume-section">
                  <div className="resume-section-title">Education</div>
                  {resume.education.map((item, index) => (
                    <div className="resume-entry" key={index}>
                      <div className="resume-entry-top">
                        <div>
                          <div className="resume-entry-title">
                            {item.degree || "Degree"}
                          </div>
                          <div className="resume-entry-sub">
                            {item.institution}
                          </div>
                        </div>
                        <div className="resume-entry-meta">
                          {item.startYear}
                          {item.endYear ? ` – ${item.endYear}` : ""}
                        </div>
                      </div>
                      {item.fieldOfStudy && (
                        <p className="resume-entry-desc">
                          {item.fieldOfStudy}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {resume.certifications.length > 0 && (
                <section className="resume-section">
                  <div className="resume-section-title">
                    Certifications
                  </div>
                  {resume.certifications.map((item, index) => (
                    <div className="resume-entry" key={index}>
                      <div className="resume-entry-title">
                        {item.name}
                      </div>
                      <div className="resume-entry-sub">
                        {item.issuer}
                        {item.issueDate ? ` · ${item.issueDate}` : ""}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {resume.achievements.length > 0 && (
                <section className="resume-section">
                  <div className="resume-section-title">Achievements</div>
                  <ul className="resume-list">
                    {resume.achievements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {!resume.personal.name &&
                !resume.personal.summary &&
                resume.skills.length === 0 &&
                resume.projects.length === 0 &&
                resume.education.length === 0 && (
                  <div className="rb-empty" style={{ marginTop: 25 }}>
                    Start filling the form to build your resume preview.
                  </div>
                )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
