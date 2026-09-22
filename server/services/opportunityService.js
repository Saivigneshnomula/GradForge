const Opportunity = require("../models/Opportunity");

const normalizeSkills = (skills = []) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => String(skill).trim())
    .filter(Boolean)
    .slice(0, 30);
};

const getMode = (location = "", description = "") => {
  const text = `${location} ${description}`.toLowerCase();

  if (
    text.includes("remote") ||
    text.includes("work from home")
  ) {
    return "Remote";
  }

  if (
    text.includes("hybrid")
  ) {
    return "Hybrid";
  }

  if (
    text.includes("online")
  ) {
    return "Online";
  }

  if (
    text.includes("on-site") ||
    text.includes("onsite")
  ) {
    return "On-site";
  }

  return "Unknown";
};

const fetchLiveJobs = async () => {
  try {
    /*
      Remotive provides publicly accessible remote job data.

      We intentionally use the server as the proxy so the
      React application does not directly depend on an
      external API.
    */

    const response = await fetch(
      "https://remotive.com/api/remote-jobs?limit=50"
    );

    if (!response.ok) {
      throw new Error(
        `Jobs API returned ${response.status}`
      );
    }

    const data = await response.json();

    const jobs = Array.isArray(data.jobs)
      ? data.jobs
      : [];

    return jobs.map((job) => ({
      title: job.title || "Software Job",

      company:
        job.company_name ||
        job.company ||
        "Company",

      type: "job",

      location:
        job.candidate_required_location ||
        "Remote",

      mode: "Remote",

      description:
        job.description || "",

      skills: normalizeSkills([
        ...(job.tags || []),
      ]),

      themes: [],

      relatedIdeas: [],

      deadline: null,

      applicationUrl:
        job.url ||
        job.candidate_required_location ||
        "#",

      source: "Remotive",

      sourceUrl: "https://remotive.com/",

      salary:
        job.salary ||
        "",

      companyLogo:
        job.company_logo ||
        "",

      externalId:
        String(job.id || ""),
    }));
  } catch (error) {
    console.error(
      "Live jobs fetch failed:",
      error.message
    );

    return [];
  }
};

/*
  Real hackathon records.

  These are refreshed/maintained separately from jobs because
  hackathon sites do not provide one universal public API.
*/

const getCurrentHackathons = () => {
  return [
    {
      title: "HackITon'26",
      company: "KPRIET",
      type: "hackathon",
      location: "Coimbatore, India",
      mode: "On-site",

      description:
        "24-hour national-level student hackathon with six technology domains and open-format problem solving.",

      skills: [
        "Web Development",
        "AI",
        "Cloud",
        "Cybersecurity",
        "IoT",
        "Software Engineering",
      ],

      themes: [
        "AI",
        "Web Development",
        "Cloud",
        "Cybersecurity",
        "IoT",
        "Software Engineering",
      ],

      relatedIdeas: [
        "AI-powered student career assistant",
        "Smart campus management platform",
        "AI cybersecurity threat detection system",
        "IoT-based campus safety platform",
        "Cloud-based student collaboration platform",
      ],

      deadline: new Date(
        "2026-09-24T23:59:00+05:30"
      ),

      applicationUrl:
        "https://www.hackiton.in/26",

      source: "HackITon'26",

      sourceUrl:
        "https://www.hackiton.in/26",

      prize: "₹20,000 + internships",

      externalId: "hackiton-26",
    },

    {
      title: "Reimagining Manipur Hackathon 2026",

      company:
        "ManipurTech Innovation Foundation",

      type: "hackathon",

      location: "Imphal, Manipur, India",

      mode: "On-site",

      description:
        "Technology hackathon focused on creating solutions around tourism and emerging technology.",

      skills: [
        "AI",
        "Web Development",
        "Mobile Development",
        "Data",
      ],

      themes: [
        "Tourism",
        "Emerging Technology",
        "Smart Tourism",
        "Digital Innovation",
      ],

      relatedIdeas: [
        "AI tourism guide for Manipur",
        "Smart tourism route planner",
        "AR heritage discovery application",
        "Local tourism marketplace",
        "AI-powered travel assistant",
      ],

      deadline: new Date(
        "2026-09-23T09:00:00+05:30"
      ),

      applicationUrl:
        "https://e-pao.net/epSubPageExtractor.asp?src=announcements.Ann_2026.Reimagining_Manipur_Hackathon_Competition_20260919",

      source: "ManipurTech Innovation Foundation",

      sourceUrl:
        "https://e-pao.net/",

      prize: "",

      externalId:
        "reimagining-manipur-2026",
    },
  ];
};

const syncOpportunities = async () => {
  const jobs = await fetchLiveJobs();

  const hackathons = getCurrentHackathons();

  const opportunities = [
    ...jobs,
    ...hackathons,
  ];

  for (const item of opportunities) {
    if (!item.applicationUrl) continue;

    await Opportunity.findOneAndUpdate(
      {
        type: item.type,
        externalId: item.externalId,
      },
      {
        $set: {
          ...item,
          isActive: true,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  return opportunities.length;
};

module.exports = {
  fetchLiveJobs,
  getCurrentHackathons,
  syncOpportunities,
};