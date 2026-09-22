import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const categories = [
  "All",
  "HR",
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "DSA",
  "MERN",
  "DevOps",
  "Cloud",
];

function GradForgeLogo() {
  return (
    <div className="gf-logo">
      <div className="gf-logo-mark">
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 8.5L12 4L21 8.5L12 13L3 8.5Z"
            fill="white"
          />

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
        <div className="gf-logo-name">GradForge</div>
        <div className="gf-logo-sub">
          FORGE YOUR FUTURE
        </div>
      </div>
    </div>
  );
}

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const date = new Date(deadline);

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTimeRemaining(deadline) {
  if (!deadline) return "";

  const difference =
    new Date(deadline).getTime() -
    Date.now();

  if (difference <= 0) {
    return "Closed";
  }

  const hours = Math.floor(
    difference / (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (difference % (1000 * 60 * 60)) /
      (1000 * 60)
  );

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  }

  return `${hours}h ${minutes}m left`;
}

function getJobSkills(opportunity) {
  return opportunity?.skills || [];
}

export default function InterviewPrep() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const initialSkills =
    searchParams.get("skills") || "";

  const [activeTab, setActiveTab] =
    useState("jobs");

  const [jobs, setJobs] = useState([]);
  const [hackathons, setHackathons] =
    useState([]);

  const [questions, setQuestions] =
    useState([]);

  const [hot, setHot] = useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [loadingJobs, setLoadingJobs] =
    useState(true);

  const [loadingHackathons, setLoadingHackathons] =
    useState(true);

  const [loadingQuestions, setLoadingQuestions] =
    useState(true);

  const [selectedHackathon, setSelectedHackathon] =
    useState(null);

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [showAnswer, setShowAnswer] =
    useState(false);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    loadJobs();
    loadHackathons();
    loadHot();
    loadQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // When a job sends us here with ?skills=..., open Interview Questions automatically.
  useEffect(() => {
    if (initialSkills) {
      setActiveTab("questions");
    }
  }, [initialSkills]);

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);

      const { data } =
        await api.get(
          "/opportunities?type=job"
        );

      setJobs(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Jobs loading failed:",
        error
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadHackathons = async () => {
    try {
      setLoadingHackathons(true);

      const { data } =
        await api.get(
          "/opportunities?type=hackathon"
        );

      setHackathons(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Hackathons loading failed:",
        error
      );
    } finally {
      setLoadingHackathons(false);
    }
  };

  const loadHot = async () => {
    try {
      const { data } =
        await api.get(
          "/opportunities/hot"
        );

      setHot(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Hot opportunities loading failed:",
        error
      );
    }
  };

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);

      const { data } =
        await api.get(
          "/interviews/questions"
        );

      setQuestions(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Interview questions loading failed:",
        error
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return jobs;

    return jobs.filter((job) => {
      const searchable = [
        job.title,
        job.company,
        job.location,
        ...(job.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [jobs, search]);

  const filteredHackathons = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return hackathons;

    return hackathons.filter(
      (hackathon) => {
        const searchable = [
          hackathon.title,
          hackathon.company,
          hackathon.location,
          ...(hackathon.skills || []),
          ...(hackathon.themes || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      }
    );
  }, [hackathons, search]);

  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    if (category !== "All") {
      result = result.filter(
        (question) =>
          question.category === category
      );
    }

    const query =
      search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (question) => {
          const searchable = [
            question.question,
            question.category,
            ...(question.tags || []),
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(query);
        }
      );
    }

    if (initialSkills) {
      const requestedSkills =
        initialSkills
          .split(",")
          .map((skill) =>
            skill.trim().toLowerCase()
          )
          .filter(Boolean);

      if (requestedSkills.length) {
        const matching = result.filter(
          (question) => {
            const text = [
              question.question,
              question.category,
              ...(question.tags || []),
            ]
              .join(" ")
              .toLowerCase();

            return requestedSkills.some(
              (skill) =>
                text.includes(skill)
            );
          }
        );

        if (matching.length) {
          result = matching;
        }
      }
    }

    return result;
  }, [
    questions,
    category,
    search,
    initialSkills,
  ]);

  const prepareForInterview = (
    opportunity
  ) => {
    const skills =
      getJobSkills(opportunity);

    const query = skills.join(",");

    setActiveTab("questions");

    setSearch("");

    navigate(
      `/interview-prep?skills=${encodeURIComponent(
        query
      )}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openQuestion = (question) => {
    const index = filteredQuestions.findIndex(
      (item) => item._id === question._id
    );

    setQuestionIndex(index >= 0 ? index : 0);
    setSelectedQuestion(question);
    setShowAnswer(false);
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setShowAnswer(false);
  };

  const nextQuestion = () => {
    if (
      questionIndex <
      filteredQuestions.length - 1
    ) {
      const nextIndex = questionIndex + 1;

      setQuestionIndex(nextIndex);
      setSelectedQuestion(filteredQuestions[nextIndex]);
      setShowAnswer(false);
    }
  };

  const previousQuestion = () => {
    if (questionIndex > 0) {
      const previousIndex = questionIndex - 1;

      setQuestionIndex(previousIndex);
      setSelectedQuestion(filteredQuestions[previousIndex]);
      setShowAnswer(false);
    }
  };

  const currentQuestion =
    filteredQuestions[questionIndex];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f6f7fb;
          color: #111827;
        }

        .career-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(79,70,229,.09),
              transparent 28%
            ),
            #f6f7fb;
        }

        .career-navbar {
          height:72px;
          background:rgba(255,255,255,.98);
          backdrop-filter:blur(16px);
          border-bottom:1px solid #e5e7eb;
          display:grid;
          grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);
          align-items:center;
          gap:18px;
          padding:0 30px;
          position:sticky;
          top:0;
          z-index:50;
        }
        .career-nav-center {
          justify-self:center;
          text-align:center;
          font-size:13px;
          color:#475569;
          font-weight:800;
          white-space:nowrap;
        }
        .career-nav-actions {
          justify-self:end;
          display:flex;
          align-items:center;
        }
        .career-dashboard-btn {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:7px;
          min-height:38px;
          padding:0 13px;
          border:1px solid #dbe1ea;
          border-radius:10px;
          background:#fff;
          color:#334155;
          font-size:11px;
          font-weight:850;
          white-space:nowrap;
          cursor:pointer;
          transition:.18s ease;
        }
        .career-dashboard-btn:hover {
          border-color:#a5b4fc;
          background:#eef2ff;
          color:#4338ca;
          transform:translateY(-1px);
        }

        .gf-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gf-logo-mark {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );
          box-shadow:
            0 8px 20px
            rgba(79,70,229,.22);
        }

        .gf-logo-name {
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -.4px;
        }

        .gf-logo-sub {
          font-size: 8px;
          font-weight: 750;
          letter-spacing: 1.4px;
          color: #6b7280;
          margin-top: 1px;
        }



        .career-container {
          max-width: 1400px;
          margin: auto;
          padding: 25px 28px 60px;
        }

        .hot-ticker {
          height: 52px;
          border-radius: 14px;
          background:
            linear-gradient(
              100deg,
              #111827,
              #312e81,
              #4c1d95
            );
          color: white;
          display: flex;
          align-items: center;
          overflow: hidden;
          box-shadow:
            0 10px 25px
            rgba(49,46,129,.18);
          margin-bottom: 25px;
        }

        .hot-label {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 18px;
          background: rgba(255,255,255,.1);
          font-weight: 850;
          font-size: 12px;
          letter-spacing: .7px;
          white-space: nowrap;
          z-index: 2;
        }

        .ticker-track {
          display: flex;
          align-items: center;
          gap: 50px;
          padding-left: 30px;
          min-width: max-content;
          animation:
            ticker 22s linear infinite;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          white-space: nowrap;
        }

        .ticker-dot {
          width: 6px;
          height: 6px;
          background: #fbbf24;
          border-radius: 50%;
          box-shadow:
            0 0 12px #fbbf24;
        }

        .ticker-deadline {
          color: #c4b5fd;
        }

        @keyframes ticker {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-35%);
          }
        }

        .hero {
          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8f7ff
            );
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 30px;
          box-shadow:
            0 12px 35px
            rgba(15,23,42,.05);
          margin-bottom: 22px;
        }

        .hero-content {
          max-width: 850px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 13px;
        }

        .hero h1 {
          font-size: clamp(28px, 4vw, 43px);
          line-height: 1.05;
          margin: 0;
          letter-spacing: -1.5px;
        }

        .hero h1 span {
          color: #4f46e5;
        }

        .hero p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
          max-width: 720px;
          margin: 12px 0 0;
        }

        .search-wrap {
          margin-top: 23px;
          position: relative;
          max-width: 750px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 17px;
        }

        .search-input {
          width: 100%;
          border: 1px solid #dbe1ea;
          border-radius: 13px;
          padding: 14px 16px 14px 44px;
          background: white;
          font-size: 13px;
          outline: none;
          box-shadow:
            0 4px 15px
            rgba(15,23,42,.035);
        }

        .search-input:focus {
          border-color: #6366f1;
          box-shadow:
            0 0 0 4px
            rgba(99,102,241,.09);
        }

        .tab-bar {
          display: flex;
          gap: 7px;
          margin-bottom: 22px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .tab {
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          white-space: nowrap;
        }

        .tab.active {
          color: white;
          background: #4f46e5;
          border-color: #4f46e5;
          box-shadow:
            0 5px 14px
            rgba(79,70,229,.2);
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 28px 0 13px;
        }

        .section-head h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -.5px;
        }

        .section-head p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #64748b;
        }

        .count-badge {
          background: #eef2ff;
          color: #4338ca;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 800;
        }

        .opportunity-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .opportunity-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 17px;
          padding: 19px;
          box-shadow:
            0 7px 22px
            rgba(15,23,42,.04);
          transition: .2s ease;
        }

        .opportunity-card:hover {
          transform: translateY(-2px);
          border-color: #c7d2fe;
          box-shadow:
            0 13px 30px
            rgba(79,70,229,.08);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .company-logo {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #eef2ff;
          color: #4338ca;
          font-size: 17px;
          font-weight: 850;
          flex-shrink: 0;
          overflow: hidden;
        }

        .company-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .card-title {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.35;
        }

        .company-name {
          margin-top: 4px;
          font-size: 12px;
          color: #64748b;
        }

        .type-badge {
          padding: 5px 8px;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 850;
          white-space: nowrap;
          height: fit-content;
        }

        .job-badge {
          background: #ecfdf5;
          color: #047857;
        }

        .hack-badge {
          background: #fff7ed;
          color: #c2410c;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 15px 0 12px;
        }

        .meta {
          font-size: 10px;
          color: #64748b;
          background: #f8fafc;
          border: 1px solid #eef2f7;
          padding: 6px 8px;
          border-radius: 7px;
        }

        .description {
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 13px;
        }

        .skill {
          font-size: 9px;
          padding: 5px 7px;
          border-radius: 6px;
          background: #eef2ff;
          color: #4338ca;
          font-weight: 700;
        }

        .deadline {
          margin-top: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 10px;
        }

        .deadline strong {
          color: #dc2626;
        }

        .deadline span {
          color: #64748b;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 15px;
        }

        .primary-btn,
        .secondary-btn {
          flex: 1;
          border-radius: 9px;
          padding: 10px 9px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
        }

        .primary-btn {
          border: 0;
          color: white;
          background: #4f46e5;
        }

        .primary-btn:hover {
          background: #4338ca;
        }

        .secondary-btn {
          border: 1px solid #dbe1ea;
          background: white;
          color: #374151;
        }

        .secondary-btn:hover {
          border-color: #a5b4fc;
          color: #4338ca;
        }

        .idea-btn {
          color: #c2410c;
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .hot-card {
          border-color: #c4b5fd;
          box-shadow:
            0 8px 25px
            rgba(99,102,241,.08);
        }

        .hot-card-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #dc2626;
          font-size: 9px;
          font-weight: 850;
          margin-bottom: 8px;
        }

        .hot-dot {
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          50% {
            opacity: .35;
          }
        }

        .questions-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 22px;
        }

        .category-bar {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          margin-bottom: 18px;
        }

        .question-card {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 17px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: .18s;
        }

        .question-card:hover {
          border-color: #a5b4fc;
          background: #fafaff;
        }

        .question-category {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          color: #4338ca;
          background: #eef2ff;
          padding: 5px 7px;
          border-radius: 6px;
          margin-bottom: 9px;
        }

        .question-text {
          font-size: 13px;
          line-height: 1.55;
          font-weight: 700;
        }

        .difficulty {
          float: right;
          font-size: 9px;
          padding: 4px 7px;
          border-radius: 6px;
          background: #f8fafc;
          color: #64748b;
        }

        .empty-state {
          padding: 55px 20px;
          text-align: center;
          background: white;
          border: 1px dashed #dbe1ea;
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 30px;
          margin-bottom: 8px;
        }

        .empty-state h3 {
          margin: 0;
          font-size: 15px;
        }

        .empty-state p {
          color: #64748b;
          font-size: 12px;
        }

        .loading {
          padding: 35px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,.58);
          backdrop-filter: blur(5px);
          display: grid;
          place-items: center;
          z-index: 100;
          padding: 20px;
        }

        .modal {
          width: min(650px, 100%);
          max-height: 85vh;
          overflow-y: auto;
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow:
            0 30px 80px
            rgba(0,0,0,.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .close-btn {
          border: 0;
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #f1f5f9;
          cursor: pointer;
          font-weight: 800;
          flex-shrink: 0;
        }

        .ideas {
          margin-top: 20px;
          display: grid;
          gap: 9px;
        }

        .idea-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 13px;
          display: flex;
          gap: 11px;
          align-items: flex-start;
        }

        .idea-number {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: #fff7ed;
          color: #c2410c;
          font-size: 10px;
          font-weight: 850;
          flex-shrink: 0;
        }

        .idea-card strong {
          font-size: 12px;
        }

        .idea-card p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 10px;
        }

        .answer-modal .answer {
          margin-top: 20px;
          padding: 17px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #374151;
          font-size: 12px;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .answer-btn {
          margin-top: 15px;
          width: 100%;
          border: 0;
          border-radius: 10px;
          padding: 12px;
          background: #4f46e5;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .question-navigation {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
        }

        .question-navigation button {
          border: 1px solid #dbe1ea;
          background: white;
          border-radius: 9px;
          padding: 9px 13px;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .question-navigation button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        @media (max-width: 850px) {
          .career-navbar {
            height:64px;
            grid-template-columns:1fr auto;
            padding:0 14px;
          }

          .career-nav-center {
            display:none;
          }

          .career-nav-actions {
            justify-self:end;
          }

          .career-dashboard-btn {
            min-height:36px;
            padding:0 10px;
            font-size:10px;
          }

          .career-container {
            padding: 15px 14px 40px;
          }

          .opportunity-grid {
            grid-template-columns: 1fr;
          }

          .hero {
            padding: 23px;
          }
        }

        @media (max-width: 520px) {
          .card-actions {
            flex-direction: column;
          }

          .hot-label {
            padding: 0 10px;
          }

          .ticker-track {
            padding-left: 15px;
          }
        }
      `}</style>

      <div className="career-page"><button type="button" onClick={() => navigate("/dashboard")} style={{position:"fixed",top:"16px",right:"20px",zIndex:100,padding:"9px 13px",border:"1px solid #e2e8f0",borderRadius:"11px",background:"#fff",fontWeight:800}}>← Dashboard</button>
        <header className="career-navbar">
          <div>
            <GradForgeLogo />
          </div>

          <div className="career-nav-center">Career & Interview Hub</div>

          <div className="career-nav-actions">
            <button
              type="button"
              className="career-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              <span aria-hidden="true">←</span>
              <span>Dashboard</span>
            </button>
          </div>
        </header>

        <main className="career-container">
          {/* HOT NEWS */}

          {hot.length > 0 && (
            <div className="hot-ticker">
              <div className="hot-label">
                🔥 HOT — CLOSING SOON
              </div>

              <div className="ticker-track">
                {[...hot, ...hot].map(
                  (item, index) => (
                    <div
                      className="ticker-item"
                      key={`${item._id}-${index}`}
                    >
                      <span className="ticker-dot" />

                      <strong>
                        {item.title}
                      </strong>

                      <span className="ticker-deadline">
                        {getTimeRemaining(
                          item.deadline
                        )}
                      </span>

                      <a
                        href={
                          item.applicationUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "white",
                          fontWeight: 800,
                          textDecoration:
                            "underline",
                        }}
                      >
                        Apply →
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* HERO */}

          <section className="hero">
            <div className="hero-content">
              <div className="hero-badge">
                ✦ GRADFORGE CAREER HUB
              </div>

              <h1>
                Find opportunities.
                <br />
                <span>Prepare to win.</span>
              </h1>

              <p>
                Discover current jobs and
                hackathons, find opportunities
                before their deadlines, and
                prepare with interview questions
                matched to the skills employers
                are looking for.
              </p>

              <div className="search-wrap">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  className="search-input"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder={
                    activeTab === "jobs"
                      ? "Search jobs, companies or skills..."
                      : activeTab ===
                        "hackathons"
                      ? "Search hackathons, themes or technologies..."
                      : "Search interview questions or skills..."
                  }
                />
              </div>
            </div>
          </section>

          {/* MAIN TABS */}

          <div className="tab-bar">
            <button
              className={`tab ${
                activeTab === "jobs"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("jobs")
              }
            >
              💼 Jobs
            </button>

            <button
              className={`tab ${
                activeTab === "hackathons"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  "hackathons"
                )
              }
            >
              ⚡ Hackathons
            </button>

            <button
              className={`tab ${
                activeTab === "questions"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  "questions"
                )
              }
            >
              🎯 Interview Questions
            </button>
          </div>

          {/* JOBS */}

          {activeTab === "jobs" && (
            <>
              <div className="section-head">
                <div>
                  <h2>
                    Jobs for Students &
                    Developers
                  </h2>

                  <p>
                    Current opportunities
                    sourced through the
                    GradForge opportunity
                    service.
                  </p>
                </div>

                <span className="count-badge">
                  {filteredJobs.length}{" "}
                  opportunities
                </span>
              </div>

              {loadingJobs ? (
                <div className="loading">
                  Loading current jobs...
                </div>
              ) : filteredJobs.length ===
                0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    💼
                  </div>

                  <h3>
                    No matching jobs
                  </h3>

                  <p>
                    Try another company,
                    technology or keyword.
                  </p>
                </div>
              ) : (
                <div className="opportunity-grid">
                  {filteredJobs.map(
                    (job) => (
                      <article
                        className="opportunity-card"
                        key={job._id}
                      >
                        <div className="card-top">
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              minWidth: 0,
                            }}
                          >
                            <div className="company-logo">
                              {job.companyLogo ? (
                                <img
                                  src={
                                    job.companyLogo
                                  }
                                  alt=""
                                />
                              ) : (
                                (
                                  job.company ||
                                  "C"
                                )
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>

                            <div>
                              <h3 className="card-title">
                                {job.title}
                              </h3>

                              <div className="company-name">
                                {job.company ||
                                  "Company"}
                              </div>
                            </div>
                          </div>

                          <span className="type-badge job-badge">
                            JOB
                          </span>
                        </div>

                        <div className="meta-row">
                          <span className="meta">
                            📍{" "}
                            {job.location ||
                              "Remote"}
                          </span>

                          <span className="meta">
                            🌐{" "}
                            {job.mode ||
                              "Remote"}
                          </span>
                        </div>

                        <div className="description">
                          {job.description?.replace(
                            /<[^>]*>/g,
                            ""
                          ) ||
                            "View the complete job description on the application page."}
                        </div>

                        <div className="skills">
                          {getJobSkills(
                            job
                          )
                            .slice(0, 6)
                            .map(
                              (skill) => (
                                <span
                                  className="skill"
                                  key={
                                    skill
                                  }
                                >
                                  {skill}
                                </span>
                              )
                            )}
                        </div>

                        <div className="card-actions">
                          <a
                            className="primary-btn"
                            href={
                              job.applicationUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Apply Now →
                          </a>

                          <button
                            className="secondary-btn"
                            onClick={() =>
                              prepareForInterview(
                                job
                              )
                            }
                          >
                            Prepare for Interview
                          </button>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* HACKATHONS */}

          {activeTab ===
            "hackathons" && (
            <>
              <div className="section-head">
                <div>
                  <h2>
                    Hackathons & Competitions
                  </h2>

                  <p>
                    Find real events,
                    deadlines and
                    technology themes.
                  </p>
                </div>

                <span className="count-badge">
                  {filteredHackathons.length}{" "}
                  events
                </span>
              </div>

              {loadingHackathons ? (
                <div className="loading">
                  Loading hackathons...
                </div>
              ) : filteredHackathons.length ===
                0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    ⚡
                  </div>

                  <h3>
                    No matching hackathons
                  </h3>

                  <p>
                    Try searching for AI,
                    Web, Cloud, IoT or
                    another technology.
                  </p>
                </div>
              ) : (
                <div className="opportunity-grid">
                  {filteredHackathons.map(
                    (hackathon) => {
                      const isHot =
                        hackathon.deadline &&
                        new Date(
                          hackathon.deadline
                        ).getTime() >
                          now &&
                        new Date(
                          hackathon.deadline
                        ).getTime() -
                          now <=
                          24 *
                            60 *
                            60 *
                            1000;

                      return (
                        <article
                          className={`opportunity-card ${
                            isHot
                              ? "hot-card"
                              : ""
                          }`}
                          key={
                            hackathon._id
                          }
                        >
                          {isHot && (
                            <div className="hot-card-label">
                              <span className="hot-dot" />
                              CLOSING WITHIN
                              24 HOURS
                            </div>
                          )}

                          <div className="card-top">
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: 12,
                              }}
                            >
                              <div className="company-logo">
                                ⚡
                              </div>

                              <div>
                                <h3 className="card-title">
                                  {
                                    hackathon.title
                                  }
                                </h3>

                                <div className="company-name">
                                  {
                                    hackathon.company
                                  }
                                </div>
                              </div>
                            </div>

                            <span className="type-badge hack-badge">
                              HACKATHON
                            </span>
                          </div>

                          <div className="meta-row">
                            <span className="meta">
                              📍{" "}
                              {
                                hackathon.location
                              }
                            </span>

                            <span className="meta">
                              ⏱{" "}
                              {getTimeRemaining(
                                hackathon.deadline
                              )}
                            </span>
                          </div>

                          <div className="description">
                            {
                              hackathon.description
                            }
                          </div>

                          <div className="skills">
                            {[
                              ...(hackathon.themes ||
                                []),
                              ...(hackathon.skills ||
                                []),
                            ]
                              .filter(
                                (item, index, arr) =>
                                  arr.indexOf(
                                    item
                                  ) ===
                                  index
                              )
                              .slice(0, 6)
                              .map(
                                (theme) => (
                                  <span
                                    className="skill"
                                    key={
                                      theme
                                    }
                                  >
                                    {theme}
                                  </span>
                                )
                              )}
                          </div>

                          {hackathon.deadline && (
                            <div className="deadline">
                              <span>
                                Registration
                                closes
                              </span>

                              <strong>
                                {formatDeadline(
                                  hackathon.deadline
                                )}
                              </strong>
                            </div>
                          )}

                          <div className="card-actions">
                            <a
                              className="primary-btn"
                              href={
                                hackathon.applicationUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Register Now →
                            </a>

                            <button
                              className="secondary-btn idea-btn"
                              onClick={() =>
                                setSelectedHackathon(
                                  hackathon
                                )
                              }
                            >
                              💡 Related Ideas
                            </button>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </>
          )}

          {/* INTERVIEW QUESTIONS */}

          {activeTab ===
            "questions" && (
            <>
              <div className="section-head">
                <div>
                  <h2>
                    Interview Questions
                  </h2>

                  <p>
                    Prepare using questions
                    related to your target
                    role and technology
                    stack.
                  </p>
                </div>

                <span className="count-badge">
                  {
                    filteredQuestions.length
                  }{" "}
                  questions
                </span>
              </div>

              <div className="questions-panel">
                <div className="category-bar">
                  {categories.map(
                    (item) => (
                      <button
                        key={item}
                        className={`tab ${
                          category ===
                          item
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          setCategory(
                            item
                          );
                          setQuestionIndex(
                            0
                          );
                        }}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                {initialSkills && (
                  <div
                    style={{
                      background:
                        "#eef2ff",
                      color: "#4338ca",
                      borderRadius: 10,
                      padding: 11,
                      fontSize: 11,
                      marginBottom: 15,
                      fontWeight: 700,
                    }}
                  >
                    🎯 Questions matched
                    to job skills:
                    <br />
                    <span
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {initialSkills}
                    </span>
                  </div>
                )}

                {loadingQuestions ? (
                  <div className="loading">
                    Loading interview
                    questions...
                  </div>
                ) : filteredQuestions.length ===
                  0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      🎯
                    </div>

                    <h3>
                      No matching questions
                    </h3>

                    <p>
                      Try another category
                      or search term.
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredQuestions.map(
                      (
                        question,
                        index
                      ) => (
                        <div
                          className="question-card"
                          key={
                            question._id ||
                            index
                          }
                          onClick={() =>
                            openQuestion(
                              question
                            )
                          }
                        >
                          <span className="question-category">
                            {
                              question.category
                            }
                          </span>

                          <span className="difficulty">
                            {
                              question.difficulty
                            }
                          </span>

                          <div className="question-text">
                            {
                              question.question
                            }
                          </div>
                        </div>
                      )
                    )}

                    <div className="question-navigation">
                      <button
                        disabled={
                          questionIndex ===
                          0
                        }
                        onClick={
                          previousQuestion
                        }
                      >
                        ← Previous
                      </button>

                      <span
                        style={{
                          alignSelf:
                            "center",
                          color:
                            "#64748b",
                          fontSize: 11,
                        }}
                      >
                        {questionIndex +
                          1}{" "}
                        /{" "}
                        {
                          filteredQuestions.length
                        }
                      </span>

                      <button
                        disabled={
                          questionIndex >=
                          filteredQuestions.length -
                            1
                        }
                        onClick={
                          nextQuestion
                        }
                      >
                        Next →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>

        {/* HACKATHON IDEAS MODAL */}

        {selectedHackathon && (
          <div
            className="modal-backdrop"
            onClick={() =>
              setSelectedHackathon(null)
            }
          >
            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <h2>
                    Related Project Ideas
                  </h2>

                  <p>
                    Ideas inspired by{" "}
                    <strong>
                      {
                        selectedHackathon.title
                      }
                    </strong>
                  </p>
                </div>

                <button
                  className="close-btn"
                  onClick={() =>
                    setSelectedHackathon(
                      null
                    )
                  }
                >
                  ×
                </button>
              </div>

              <div className="ideas">
                {(
                  selectedHackathon.relatedIdeas ||
                  []
                ).map(
                  (idea, index) => (
                    <div
                      className="idea-card"
                      key={index}
                    >
                      <div className="idea-number">
                        {index + 1}
                      </div>

                      <div>
                        <strong>
                          {idea}
                        </strong>

                        <p>
                          Build this as a
                          potential
                          hackathon solution
                          and add it to your
                          GradForge projects.
                        </p>
                      </div>
                    </div>
                  )
                )}

                {(!selectedHackathon.relatedIdeas ||
                  selectedHackathon
                    .relatedIdeas
                    .length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon">
                      💡
                    </div>

                    <h3>
                      Ideas coming soon
                    </h3>

                    <p>
                      More project ideas
                      will be generated
                      from the hackathon
                      themes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION MODAL */}

        {selectedQuestion && (
          <div
            className="modal-backdrop"
            onClick={closeQuestion}
          >
            <div
              className="modal answer-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <span className="question-category">
                    {
                      selectedQuestion.category
                    }
                  </span>

                  <h2>
                    {
                      selectedQuestion.question
                    }
                  </h2>

                  <p>
                    Difficulty:{" "}
                    {
                      selectedQuestion.difficulty
                    }
                  </p>
                </div>

                <button
                  className="close-btn"
                  onClick={closeQuestion}
                >
                  ×
                </button>
              </div>

              {!showAnswer ? (
                <button
                  className="answer-btn"
                  onClick={() =>
                    setShowAnswer(
                      true
                    )
                  }
                >
                  Show Answer
                </button>
              ) : (
                <div className="answer">
                  {
                    selectedQuestion.answer
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}