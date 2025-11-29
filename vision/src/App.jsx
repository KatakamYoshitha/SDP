import React, { useState, useEffect } from "react";
import { FaHeartbeat, FaBookOpen, FaBrain, FaRobot, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "./index.css";
import img from "./assets/img.jpg";

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
  },
  {
    name: "Sleep Reset & Wellness",
    start: "2025-12-05",
    description: "Fix your sleep cycle with science-backed techniques."
  },
  {
    name: "Art Therapy Expression",
    start: "2025-12-10",
    description: "Use colors, drawing and creativity to release stress."
  },
  {
    name: "Walk & Talk Outdoor Therapy",
    start: "2025-12-15",
    description: "Improve mental clarity through nature walks."
  },
  {
    name: "Digital Detox Challenge",
    start: "2025-12-18",
    description: "Reduce screen time and improve overall wellness."
  },
  {
    name: "Positive Psychology Session",
    start: "2025-12-22",
    description: "Practice gratitude and cognitive reframing."
  },
  {
    name: "Time-Management Mastery",
    start: "2025-12-25",
    description: "Learn planning techniques to reduce academic stress."
  }
]);


  const [articles, setArticles] = useState([
    {
      title: "5 Tips to Manage Stress",
      content: "Practice deep breathing, take breaks, hydrate and sleep well."
    },
    {
      title: "Fix Your Sleep Cycle",
      content: "Avoid screens before bed & keep a consistent routine."
    }
  ]);

  const [supportRequests, setSupportRequests] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
useEffect(() => {
  if (activeSection === "chat") {
    // Prevent duplicate script loading
    const existing = document.getElementById("noupe-script");
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://www.noupe.com/embed/019acec8c5da71fbb53af7c328bce7e1135e.js";
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

  // CHECK IF USER ALREADY EXISTS
  if (users.some((u) => u.username === username)) {
    alert("User already exists!");
    return;
  }

  // CREATE NEW USER
  const newUser = {
    username,
    password,
    role,
    joinedPrograms: []
  };

  // SAVE ALL USERS
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created! Please login.");
  setIsSignup(false);  // go back to login
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

  /* -------------------- CHATBOT LOGIC -------------------- */
  const getBotReply = (msg) => {
    msg = msg.toLowerCase();

    if (/(hi|hello|hey|yo)/.test(msg)) {
      return "Hello! 🌼 How are you feeling today?";
    }

    if (msg.includes("how are you")) {
      return "I'm feeling great 💛 I'm here for you. How can I help?";
    }

    if (msg.includes("stress")) {
      return "Stress is tough 💛 Try inhaling for 4 seconds, holding for 4, then exhaling for 6.";
    }

    if (msg.includes("sleep")) {
      return "Good sleep is important 😴 Try avoiding screens 30 minutes before bed.";
    }

    if (msg.includes("sad") || msg.includes("depress")) {
      return "I’m really sorry you're feeling this way 💛 You matter. Want to talk?";
    }

    if (msg.includes("anxiety")) {
      return "Try grounding: Name 5 things you see, 4 things you feel, 3 you hear 💙";
    }

    if (msg.includes("study") || msg.includes("focus")) {
      return "Try the Pomodoro method ⏳ 25 mins study → 5 min break.";
    }

    return "I'm here for you 🌿 Tell me more.";
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = { text: chatInput, type: "user" };
    setChatMessages((prev) => [...prev, userMsg]);

    const reply = getBotReply(chatInput);

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { text: reply, type: "bot" }]);
    }, 600);

    setChatInput("");
  };

  /* -------------------- PROGRAMS -------------------- */
  const joinProgram = (index) => {
    const prog = programs[index];

    if (!currentUser.joinedPrograms.some((p) => p.name === prog.name)) {
      const updatedUser = {
        ...currentUser,
        joinedPrograms: [...currentUser.joinedPrograms, { ...prog, completed: false }],
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
      ),
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  /* -------------------- SUPPORT -------------------- */
  const handleSupport = (e) => {
    e.preventDefault();
    const msg = e.target.supportMessage.value;
    const newReq = { user: currentUser.username, message: msg, status: "pending" };
    setSupportRequests([...supportRequests, newReq]);
    e.target.reset();
  };

  /* -------------------- ADMIN ADDING -------------------- */
  const addResource = (e) => {
    e.preventDefault();
    const newRes = {
      title: e.target.resourceTitle.value,
      category: e.target.resourceCategory.value,
      description: e.target.resourceDesc.value,
    };
    setResources([...resources, newRes]);
    e.target.reset();
  };

  const addProgram = (e) => {
    e.preventDefault();
    const newProg = {
      name: e.target.programName.value,
      start: e.target.startDate.value,
      description: e.target.programDesc.value,
    };
    setPrograms([...programs, newProg]);
    e.target.reset();
  };

  const addArticle = (e) => {
    e.preventDefault();
    const newA = {
      title: e.target.articleTitle.value,
      content: e.target.articleContent.value,
    };
    setArticles([...articles, newA]);
    e.target.reset();
  };

  /* -------------------- UI RENDERING -------------------- */
  return (
    <div>

      {/* HEADER */}
      <header>
        <h1><FaHeartbeat /> Student Health & Wellness <FaBrain /></h1>

        {currentUser && (
          <nav>
            <button onClick={() => setActiveSection("home")}>Home</button>
            <button onClick={() => setActiveSection("sessions")}>Sessions</button>
            <button onClick={() => setActiveSection("articles")}>Articles</button>
            <button onClick={() => setActiveSection("progress")}>Progress</button>
            <button onClick={() => setActiveSection("support")}>Support</button>
            <button onClick={() => setActiveSection("chat")}>Chat AI</button>

            {currentUser.role === "admin" && (
              <button onClick={() => setActiveSection("admin")}>Admin</button>
            )}

            <button onClick={logout}><FaSignOutAlt /> Logout</button>
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
                  <>Already have an account? <span className="switch-link" onClick={() => setIsSignup(false)}>Login</span></>
                ) : (
                  <>Don't have an account? <span className="switch-link" onClick={() => setIsSignup(true)}>Sign Up</span></>
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
              <p><b>{r.category}</b> — {r.description}</p>
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
          <h2 className="page-title"><FaBookOpen /> Articles</h2>

          {articles.map((a, i) => (
            <div key={i} className="card">
              <h4>{a.title}</h4>
              <p>{a.content}</p>
            </div>
          ))}
        </section>
      )}

      {/* PROGRESS */}
      {currentUser && activeSection === "progress" && (
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

      {/* SUPPORT */}
      {currentUser && activeSection === "support" && (
        <section>
          <h2 className="page-title">Support 💌</h2>

          <form onSubmit={handleSupport}>
            <textarea name="supportMessage" required placeholder="Describe your concern..." />
            <button type="submit">Submit</button>
          </form>
        </section>
      )}

      {currentUser && activeSection === "chat" && (
  <section className="chat-ai-container">

    {/* HERO SECTION */}
    <div className="chat-ai-hero">
      <h2><FaRobot /> Wellness AI Companion</h2>
      <p>
        Your personal mental wellness assistant 🤖💚  
        Ask anything about stress, focus, motivation, or health.  
        I'm here to support you anytime.
      </p>
    </div>

    {/* FEATURE NAVIGATION */}
    <div className="chat-ai-features">
      <div className="feature-card">
        <h4>💬 Smart Answers</h4>
        <p>Ask wellness-related questions and get instant guidance.</p>
      </div>
      <div className="feature-card">
        <h4>🧠 Mental Support</h4>
        <p>Helpful tips to calm your mind and manage stress.</p>
      </div>
      <div className="feature-card">
        <h4>📘 Study Help</h4>
        <p>Focus tips, productivity hacks, and motivation boosts.</p>
      </div>
    </div>

    {/* WELLNESS TIPS */}
    <div className="wellness-tips">
      <h3>🌱 Quick Wellness Tips</h3>
      <ul>
        <li>⭐ Take 3 deep breaths before starting any task.</li>
        <li>⭐ Drink water every 30 minutes to stay alert.</li>
        <li>⭐ Stretch your neck & shoulders every hour.</li>
        <li>⭐ Avoid screens 20 mins before sleep.</li>
      </ul>
    </div>

    {/* NOUPE CHATBOT */}
    <div className="chatbot-center">
  <div id="noupe-chat-widget"></div>
</div>


  </section>
)}


      {/* ADMIN */}
      {currentUser && currentUser.role === "admin" && activeSection === "admin" && (
        <section>
          <h2 className="page-title">Admin Panel 🛠️</h2>

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

          <h3 className="feature-title">Add Session</h3>
          <form onSubmit={addProgram}>
            <input name="programName" placeholder="Session Name" required />
            <input name="startDate" type="date" required />
            <textarea name="programDesc" required placeholder="Description" />
            <button type="submit">Add Session</button>
          </form>

          <h3 className="feature-title">Add Article</h3>
          <form onSubmit={addArticle}>
            <input name="articleTitle" placeholder="Title" required />
            <textarea name="articleContent" placeholder="Content" required />
            <button type="submit">Publish</button>
          </form>

          <h3 className="feature-title">Metrics 📊</h3>
          <div id="metrics">
            <p><b>Total Resources:</b> {resources.length}</p>
            <p><b>Total Sessions:</b> {programs.length}</p>
            <p><b>Total Articles:</b> {articles.length}</p>
            <p><b>Total Support Requests:</b> {supportRequests.length}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
