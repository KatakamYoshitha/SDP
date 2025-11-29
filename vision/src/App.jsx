import React, { useState, useEffect } from "react";
import { FaHeartbeat, FaBookOpen, FaBrain, FaRobot, FaSignOutAlt } from "react-icons/fa";
import "./index.css";
import img from "./assets/img.jpg";
import MazeGame from "./MazeGame";
import DinoGame from "./DinoGame";
import TicTacToe from "./TicTacToe";
import QuizComponent from "./QuizComponent";


function App() {
  /* -------------------- STATES -------------------- */
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const [activeSection, setActiveSection] = useState(currentUser ? "home" : "login");
  const [isSignup, setIsSignup] = useState(false);

  const [resources, setResources] = useState([
    {
      title: "Mindful Breathing",
      category: "Mental Health",
      description: "Deep breathing to reduce anxiety and calm your mind."
    },
    {
      title: "Healthy Eating",
      category: "Nutrition",
      description: "Learn the basics of a healthy diet and energy-boosting foods."
    },
    {
      title: "Meditation Basics",
      category: "Mindfulness",
      description: "A simple guide to starting meditation."
    }
  ]);
  const [quizQuestions, setQuizQuestions] = useState([
  {
    question: "What is the best way to reduce stress quickly?",
    options: ["Deep breathing", "Scrolling Instagram", "Skipping meals"],
    answer: "Deep breathing"
  },
  {
    question: "How many hours of sleep should a student get?",
    options: ["3–4", "5–6", "7–9"],
    answer: "7–9"
  }
]);

  const [programs, setPrograms] = useState([
    {
      name: "Mindful Breathing Workshop",
      start: "2025-11-10",
      description: "Learn grounding and deep breathing techniques."
    },
    {
      name: "Yoga for Mental Clarity",
      start: "2025-11-15",
      description: "Gentle yoga to reduce anxiety and increase focus."
    },
    {
      name: "Nutrition for Brain Health",
      start: "2025-11-20",
      description: "Understand how food influences mood and energy."
    },
    {
      name: "Overcoming Exam Stress",
      start: "2025-12-01",
      description: "Improve emotional resilience before exams."
    }
  ]);

  const [articles, setArticles] = useState([
    {
      title: "How to Reduce Exam Stress",
      content: "Simple techniques to manage pressure and stay calm.",
      link: "https://www.ucl.ac.uk/news/2017/apr/7-tips-help-you-cope-exam-stress"
    },
    {
      title: "Improve Your Sleep Naturally",
      content: "Sleep cycles, habits, and science-backed tips.",
      link: "https://www.sleepfoundation.org/sleep-hygiene"
    },
    {
      title: "Benefits of Meditation",
      content: "How meditation improves your mind and body.",
      link: "https://www.mindful.org/meditation/mindfulness-getting-started/"
    },
    {
      title: "Healthy Eating for Students",
      content: "Nutrition tips for focus, energy, and mood.",
      link: "https://www.nhs.uk/live-well/eat-well/food-and-drinks-for-studying/"
    }
  ]);

  // Feedbacks stored locally (for admin panel)
  const [feedbacks, setFeedbacks] = useState([]);

  const [dummySupportCount, setDummySupportCount] = useState(0); // only for metrics count

  const updateFeedbacks = (list) => {
    setFeedbacks(list);
  };

  /* -------------------- CHATBOT SCRIPT -------------------- */
  useEffect(() => {
    if (activeSection === "chat") {
      const existing = document.getElementById("noupe-script");
      if (existing) return;

      const script = document.createElement("script");
      script.src =
        "https://www.noupe.com/embed/019acec8c5da71fbb53af7c328bce7e1135e.js";
      script.id = "noupe-script";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [activeSection]);

  /* -------------------- SIGNUP -------------------- */
  const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const role = e.target.role.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.username === username)) {
      alert("User already exists!");
      return;
    }

    const newUser = {
      username,
      password,
      role,
      joinedPrograms: []
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! Please login.");
    setIsSignup(false);
  };

  /* -------------------- LOGIN -------------------- */
  const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      alert("Incorrect username or password!");
      return;
    }

    setCurrentUser(foundUser);
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    setActiveSection("home");
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveSection("login");
  };

  /* -------------------- PROGRAMS -------------------- */
  const joinProgram = (index) => {
    const prog = programs[index];

    if (!currentUser.joinedPrograms.some((p) => p.name === prog.name)) {
      const updatedUser = {
        ...currentUser,
        joinedPrograms: [...currentUser.joinedPrograms, { ...prog, completed: false }]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const completeProgram = (name) => {
    const updatedUser = {
      ...currentUser,
      joinedPrograms: currentUser.joinedPrograms.map((p) =>
        p.name === name ? { ...p, completed: true } : p
      )
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  /* -------------------- SUPPORT (STUDENT) -------------------- */
  const handleSupport = (e) => {
    e.preventDefault();
    const msg = e.target.supportMessage.value;

    const newReq = {
      user: currentUser.username,
      message: msg,
      status: "pending",
      reply: "",
      time: new Date().toLocaleString()
    };

    updateFeedbacks([...feedbacks, newReq]);
    setDummySupportCount((c) => c + 1); // only for metrics count
    alert("Your feedback was submitted!");
    e.target.reset();
  };

  /* -------------------- ADMIN ADDING -------------------- */
  const addResource = (e) => {
    e.preventDefault();
    const newRes = {
      title: e.target.resourceTitle.value,
      category: e.target.resourceCategory.value,
      description: e.target.resourceDesc.value
    };
    setResources([...resources, newRes]);
    e.target.reset();
  };

  const addProgram = (e) => {
    e.preventDefault();
    const newProg = {
      name: e.target.programName.value,
      start: e.target.startDate.value,
      description: e.target.programDesc.value
    };
    setPrograms([...programs, newProg]);
    e.target.reset();
  };

  const addArticle = (e) => {
    e.preventDefault();

    const newA = {
      title: e.target.articleTitle.value,
      content: e.target.articleContent.value,
      link: e.target.articleLink.value
    };

    const updated = [...articles, newA];
    setArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));
    e.target.reset();
  };

  /* -------------------- UI -------------------- */
  return (
    <div>
      {/* HEADER */}
      <header>
        <h1>
          <FaHeartbeat /> Student Health & Wellness <FaBrain />
        </h1>

        {currentUser && (
          <nav>
            <button onClick={() => setActiveSection("home")}>Home</button>
            <button onClick={() => setActiveSection("sessions")}>Sessions</button>
            <button onClick={() => setActiveSection("articles")}>Articles</button>

            {/* STUDENT ONLY NAV */}
            {currentUser.role === "student" && (
              <>
                <button onClick={() => setActiveSection("progress")}>Progress</button>
                <button onClick={() => setActiveSection("support")}>Support</button>
                <button onClick={() => setActiveSection("chat")}>Chat AI</button>
                <button onClick={() => setActiveSection("games")}>Stress Free Games</button>
                <button onClick={() => setActiveSection("quiz")}>Wellness Quiz</button>
              </>
            )}
      {currentUser && activeSection === "quiz" && currentUser.role === "student" && (
  <section className="quiz-page">
    <QuizComponent />
  </section>
)}
            {/* ADMIN ONLY NAV */}
            {currentUser.role === "admin" && (
              <>
                <button onClick={() => setActiveSection("admin")}>Admin</button>
                <button onClick={() => setActiveSection("feedbacks")}>Feedbacks</button>
              </>
            )}

            <button onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        )}
      </header>

      {/* LOGIN + SIGNUP */}
      {!currentUser && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-left">
              <img src={img} alt="Wellness" />
            </div>

            <div className="auth-right">
              <h2 className="auth-title">{isSignup ? "Create Account ✨" : "Login"}</h2>

              <form onSubmit={isSignup ? handleSignup : handleLogin} className="auth-form">
                <label>Username</label>
                <input name="username" type="text" required />

                <label>Password</label>
                <input name="password" type="password" required />

                {isSignup && (
                  <>
                    <label>Role</label>
                    <select name="role">
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </>
                )}

                <button className="auth-btn" type="submit">
                  {isSignup ? "Create Account" : "Log In"}
                </button>
              </form>

              <p className="switch-text">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <span className="switch-link" onClick={() => setIsSignup(false)}>
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span className="switch-link" onClick={() => setIsSignup(true)}>
                      Sign Up
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HOME */}
      {currentUser && activeSection === "home" && (
        <section>
          <h2 className="welcome-text">Welcome, {currentUser.username}! 🌼</h2>
          <h3 className="feature-title">Featured Resources</h3>

          {resources.map((r, i) => (
            <div key={i} className="card">
              <h4>{r.title}</h4>
              <p>
                <b>{r.category}</b> — {r.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* SESSIONS */}
      {currentUser && activeSection === "sessions" && (
        <section>
          <h2 className="page-title">Sessions 💡</h2>

          {programs.map((p, i) => (
            <div key={i} className="card">
              <h4>{p.name}</h4>
              <p>Date: {p.start}</p>
              <p>{p.description}</p>

              {currentUser.role === "student" && (
                <button onClick={() => joinProgram(i)}>Join</button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ARTICLES */}
      {currentUser && activeSection === "articles" && (
        <section>
          <h2 className="page-title">
            <FaBookOpen /> Wellness Articles
          </h2>

          {articles.map((a, i) => (
            <div key={i} className="card">
              <h3>{a.title}</h3>
              <p>{a.content}</p>

              <button
                onClick={() => window.open(a.link, "_blank")}
                className="read-btn"
              >
                Read Article
              </button>
            </div>
          ))}
        </section>
      )}

      {/* PROGRESS (STUDENT ONLY) */}
      {currentUser && currentUser.role === "student" && activeSection === "progress" && (
        <section>
          <h2 className="page-title">My Progress 🌟</h2>

          {currentUser.joinedPrograms.length === 0 && <p>No sessions joined yet.</p>}

          {currentUser.joinedPrograms.map((p, i) => (
            <div key={i} className="card">
              <h4>{p.name}</h4>
              <p>Status: {p.completed ? "Completed ✔️" : "In Progress ⏳"}</p>

              {!p.completed && (
                <button onClick={() => completeProgram(p.name)}>Mark Completed</button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* GAMES MENU */}
      {currentUser && currentUser.role === "student" && activeSection === "games" && (
        <section className="games-menu">
          <h2>🎮 Stress-Free Games</h2>
          <p>Select a game to relax and refresh your mind!</p>
          <br />

          <button onClick={() => setActiveSection("maze")}>🧩 Maze Game</button>
          <br />
          <br />
          <button onClick={() => setActiveSection("dino")}>🦖 Dino Runner</button>
          <br />
          <br />
          <button onClick={() => setActiveSection("tictactoe")}>
            ⭕ Tic Tac Toe ❌
          </button>
        </section>
      )}

      {/* DINO GAME */}
      {currentUser && currentUser.role === "student" && activeSection === "dino" && (
        <section>
          <DinoGame />
        </section>
      )}

      {/* TIC TAC TOE */}
      {currentUser && currentUser.role === "student" && activeSection === "tictactoe" && (
        <section>
          <TicTacToe />
        </section>
      )}

      {/* MAZE GAME */}
      {currentUser && currentUser.role === "student" && activeSection === "maze" && (
        <section className="maze-section">
          <h2>🧩 Relaxing Maze Game</h2>
          <p>Use arrow keys ↑ ↓ ← → to move the ball and reach the goal!</p>
          <MazeGame />
        </section>
      )}

      {/* SUPPORT (STUDENT) */}
      {currentUser && currentUser.role === "student" && activeSection === "support" && (
        <section>
          <h2 className="page-title">Support 💌</h2>

          <form onSubmit={handleSupport}>
            <textarea
              name="supportMessage"
              required
              placeholder="Describe your concern..."
            />
            <button type="submit">Submit</button>
          </form>
        </section>
      )}

      {/* CHAT AI (STUDENT) */}
      {currentUser && currentUser.role === "student" && activeSection === "chat" && (
        <section className="chat-ai-container">
          <div className="chat-ai-hero">
            <h2>
              <FaRobot /> Wellness AI Companion
            </h2>
            <p>Your personal mental wellness assistant 🤖💚</p>
          </div>

          <div className="chatbot-center">
            <div id="noupe-chat-widget"></div>
          </div>
        </section>
      )}

      {/* ADMIN FEEDBACKS */}
      {currentUser && currentUser.role === "admin" && activeSection === "feedbacks" && (
        <section>
          <h2 className="page-title">Student Feedbacks 💬</h2>

          {feedbacks.length === 0 && <p>No feedback received yet.</p>}

          {feedbacks.map((req, index) => (
            <div key={index} className="card">
              <p>
                <b>User:</b> {req.user}
              </p>
              <p>
                <b>Message:</b> {req.message}
              </p>
              <p>
                <b>Time:</b> {req.time}
              </p>
              <p>
                <b>Status:</b> {req.status}
              </p>

              <label>Reply:</label>
              <textarea
                value={req.reply || ""}
                onChange={(e) => {
                  const updated = [...feedbacks];
                  updated[index].reply = e.target.value;
                  updateFeedbacks(updated);
                }}
                placeholder="Type your reply..."
              />

              <button
                onClick={() => {
                  const updated = [...feedbacks];
                  updated[index].status = "resolved";
                  updateFeedbacks(updated);
                }}
              >
                Mark Resolved ✔
              </button>

              <button
                className="danger-btn"
                 onClick={() => {
                  const updated = feedbacks.filter((_, i) => i !== index);
                  updateFeedbacks(updated);
                }}
              >
                Delete ❌
              </button>
            </div>
          ))}
        </section>
      )}

      {/* ADMIN PANEL */}
      {currentUser && currentUser.role === "admin" && activeSection === "admin" && (
        <section>
          <h2 className="page-title">Admin Panel 🛠️</h2>

          {/* ADD RESOURCE */}
          <h3 className="feature-title">Add Resource</h3>
          <form onSubmit={addResource}>
            <input name="resourceTitle" placeholder="Resource Title" required />
            <select name="resourceCategory">
              <option value="Mental Health">Mental Health</option>
              <option value="Fitness">Fitness</option>
              <option value="Nutrition">Nutrition</option>
            </select>
            <textarea name="resourceDesc" required placeholder="Description" />
            <button type="submit">Add Resource</button>
          </form>

          {/* ADD SESSION */}
          <h3 className="feature-title">Add Session</h3>
          <form onSubmit={addProgram}>
            <input name="programName" placeholder="Session Name" required />
            <input name="startDate" type="date" required />
            <textarea name="programDesc" required placeholder="Description" />
            <button type="submit">Add Session</button>
          </form>

          {/* ADD ARTICLE */}
          <h3 className="feature-title">Add Article</h3>
          <form onSubmit={addArticle}>
            <input name="articleTitle" placeholder="Article Title" required />
            <textarea
              name="articleContent"
              placeholder="Short Description"
              required
            />
            <input
              name="articleLink"
              placeholder="Article URL (https://...)"
              required
            />
            <button type="submit">Publish Article</button>
          </form>

          {/* METRICS */}
          <h3 className="feature-title">Metrics 📊</h3>
          <div id="metrics">
            <p><b>Total Resources:</b> {resources.length}</p>
            <p><b>Total Sessions:</b> {programs.length}</p>
            <p><b>Total Articles:</b> {articles.length}</p>
            <p><b>Total Feedbacks:</b> {feedbacks.length}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
