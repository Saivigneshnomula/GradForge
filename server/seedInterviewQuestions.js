require("dotenv").config();

const mongoose = require("mongoose");
const InterviewQuestion = require("./models/InterviewQuestion");

const questions = [
  {
    question: "Tell me about yourself.",
    answer:
      "Give a concise introduction covering your education, technical skills, important projects, experience, and the type of role you are targeting.",
    category: "HR",
    difficulty: "Easy",
    tags: ["introduction", "hr"],
  },

  {
    question: "Why should we hire you?",
    answer:
      "Connect your relevant technical skills, projects, problem-solving ability, willingness to learn, and the value you can bring to the role.",
    category: "HR",
    difficulty: "Easy",
    tags: ["hr", "behavioral"],
  },

  {
    question: "What are your strengths?",
    answer:
      "Choose two or three genuine strengths and briefly support them with examples from projects, academics, internships, or other relevant experiences.",
    category: "HR",
    difficulty: "Easy",
    tags: ["hr", "strengths"],
  },

  {
    question: "What is JavaScript?",
    answer:
      "JavaScript is a high-level programming language widely used to create interactive web applications. It can run in browsers and on servers through environments such as Node.js.",
    category: "JavaScript",
    difficulty: "Easy",
    tags: ["javascript", "basics"],
  },

  {
    question: "What is the difference between var, let and const?",
    answer:
      "var is function-scoped, while let and const are block-scoped. let can be reassigned, while const cannot be reassigned after initialization.",
    category: "JavaScript",
    difficulty: "Easy",
    tags: ["javascript", "variables"],
  },

  {
    question: "What is a Promise in JavaScript?",
    answer:
      "A Promise represents the eventual completion or failure of an asynchronous operation. It can be pending, fulfilled, or rejected.",
    category: "JavaScript",
    difficulty: "Medium",
    tags: ["javascript", "async", "promise"],
  },

  {
    question: "What is React?",
    answer:
      "React is a JavaScript library for building user interfaces using reusable components and a declarative programming approach.",
    category: "React",
    difficulty: "Easy",
    tags: ["react", "frontend"],
  },

  {
    question: "What are React Hooks?",
    answer:
      "Hooks are functions that allow functional React components to use features such as state and lifecycle-related behavior. Common examples include useState and useEffect.",
    category: "React",
    difficulty: "Medium",
    tags: ["react", "hooks"],
  },

  {
    question: "What is Node.js?",
    answer:
      "Node.js is a JavaScript runtime built on the V8 engine that allows JavaScript to execute outside the browser and is commonly used for backend applications.",
    category: "Node.js",
    difficulty: "Easy",
    tags: ["node", "backend"],
  },

  {
    question: "What is middleware in Express.js?",
    answer:
      "Middleware is a function that runs during the request-response cycle and can access the request, response, and next function. It is commonly used for authentication, logging, validation, and error handling.",
    category: "Node.js",
    difficulty: "Medium",
    tags: ["express", "middleware"],
  },

  {
    question: "What is MongoDB?",
    answer:
      "MongoDB is a NoSQL document database that stores data in flexible BSON documents instead of traditional relational tables.",
    category: "MongoDB",
    difficulty: "Easy",
    tags: ["mongodb", "database"],
  },

  {
    question: "What is the difference between SQL and NoSQL databases?",
    answer:
      "SQL databases generally use structured tables and relationships, while NoSQL databases such as MongoDB use flexible document-oriented data models.",
    category: "MongoDB",
    difficulty: "Medium",
    tags: ["database", "sql", "nosql"],
  },

  {
    question: "What is the time complexity of binary search?",
    answer:
      "Binary search has O(log n) time complexity because the search space is approximately divided in half after every comparison.",
    category: "DSA",
    difficulty: "Medium",
    tags: ["dsa", "binary-search"],
  },

  {
    question: "What is the difference between an array and a linked list?",
    answer:
      "Arrays store elements in contiguous memory and provide efficient indexed access, while linked lists consist of connected nodes and can efficiently insert or remove nodes when the position is known.",
    category: "DSA",
    difficulty: "Easy",
    tags: ["dsa", "array", "linked-list"],
  },

  {
    question: "What is MERN stack?",
    answer:
      "MERN stands for MongoDB, Express.js, React, and Node.js. It is commonly used to build full-stack JavaScript web applications.",
    category: "MERN",
    difficulty: "Easy",
    tags: ["mern", "full-stack"],
  },

  {
    question: "What is Docker?",
    answer:
      "Docker is a containerization platform that packages an application and its dependencies into portable containers so it can run consistently across environments.",
    category: "DevOps",
    difficulty: "Easy",
    tags: ["docker", "devops"],
  },

  {
    question: "What is Kubernetes?",
    answer:
      "Kubernetes is a container orchestration platform used to deploy, manage, scale, and maintain containerized applications.",
    category: "DevOps",
    difficulty: "Medium",
    tags: ["kubernetes", "devops"],
  },

  {
    question: "What is cloud computing?",
    answer:
      "Cloud computing provides computing resources such as servers, storage, databases, networking, and other services over the internet on demand.",
    category: "Cloud",
    difficulty: "Easy",
    tags: ["cloud", "aws"],
  },
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await InterviewQuestion.deleteMany({});

    await InterviewQuestion.insertMany(questions);

    console.log(
      `${questions.length} interview questions inserted successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedQuestions();