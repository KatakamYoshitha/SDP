import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaBookOpen, FaBrain, FaRobot, FaSignOutAlt } from "react-icons/fa";
import "./index.css";

function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [activeSection, setActiveSection] = useState(currentUser ? "home" : "login");
  const [resources, setResources] = useState(JSON.parse(localStorage.getItem("resources")) || []);
  const [programs, setPrograms] = useState(
    JSON.parse(localStorage.getItem("programs")) || [
      { name: "Mindful Breathing", start: "2025-11-10", description: "Relax with guided breathing exercises." },
      { name: "Yoga for Focus", start: "2025-11-15", description: "Stretch & build calmness for better focus." },
      { name: "Healthy Eating Basics", start: "2025-11-20", description: "Learn how food affects your mood & energy." },
    ]
  );
  const [articles, setArticles] = useState(JSON.parse(localStorage.getItem("articles")) || []);
  const [supportRequests, setSupportRequests] = useState(JSON.parse(localStorage.getItem("supportRequests")) || []);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
    localStorage.setItem("programs", JSON.stringify(programs));
    localStorage.setItem("articles", JSON.stringify(articles));
    localStorage.setItem("supportRequests", JSON.stringify(supportRequests));
  }, [resources, programs, articles, supportRequests]);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const role = e.target.role.value;
    const user = { username, role, joinedPrograms: [] };
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setActiveSection("home");
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

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
    const newArticle = {
      title: e.target.articleTitle.value,
      content: e.target.articleContent.value,
    };
    setArticles([...articles, newArticle]);
    e.target.reset();
  };

  const joinProgram = (index) => {
    const prog = programs[index];
    if (!currentUser.joinedPrograms.some((p) => p.name === prog.name)) {
      const updatedUser = {
        ...currentUser,
        joinedPrograms: [...currentUser.joinedPrograms, { ...prog, completed: false }],
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      alert(`You joined ${prog.name}`);
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

  const handleSupport = (e) => {
    e.preventDefault();
    const msg = e.target.supportMessage.value;
    const newReq = { user: currentUser.username, message: msg, status: "pending" };
    setSupportRequests([...supportRequests, newReq]);
    e.target.reset();
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { text: chatInput, type: "user" };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput("");
    setTimeout(() => {
      const botReply = getBotReply(chatInput);
      setChatMessages((prev) => [...prev, { text: botReply, type: "bot" }]);
    }, 600);
  };

  const getBotReply = (msg) => {
    msg = msg.toLowerCase();
    if (msg.includes("stress")) return "Try deep breathing: inhale 4s, hold 4s, exhale 6s 🌿";
    if (msg.includes("sleep")) return "Aim for 7–8 hours of sleep. Avoid screens before bed 😴";
    if (msg.includes("anxiety")) return "Ground yourself: focus on 5 things you see, 4 you feel, 3 you hear 💙";
    if (msg.includes("hello") || msg.includes("hi")) return "Hello! I’m your wellness companion 🤖 How are you feeling today?";
    return "I'm here for you 💖 Remember to take breaks and breathe.";
  };

  return (
    <div>
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

      {!currentUser && activeSection === "login" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2>Login to Wellness Portal 🌸</h2>
          <form onSubmit={handleLogin}>
            <input type="text" name="username" placeholder="Enter username" required />
            <select name="role">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Login</button>
          </form>
        </motion.section>
      )}

      {currentUser && activeSection === "home" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Welcome, {currentUser.username}! 🌼</h2>
          <h3>Featured Resources</h3>
          {resources.length ? (
            resources.map((r, i) => (
              <div key={i} className="card">
                <h4>{r.title}</h4>
                <p><b>{r.category}</b> - {r.description}</p>
              </div>
            ))
          ) : (
            <p>No resources yet.</p>
          )}
        </motion.section>
      )}

      {currentUser && activeSection === "sessions" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Upcoming Wellness Sessions 💡</h2>
          {programs.map((p, i) => (
            <div key={i} className="card">
              <h4>{p.name}</h4>
              <p>Date: {p.start}</p>
              <p>{p.description}</p>
              {currentUser.role === "student" && (
                <button className="btn" onClick={() => joinProgram(i)}>Join</button>
              )}
            </div>
          ))}
        </motion.section>
      )}

      {currentUser && activeSection === "articles" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2><FaBookOpen /> Wellness Articles & Books</h2>
          {articles.length ? (
            articles.map((a, i) => (
              <div key={i} className="card">
                <h4>{a.title}</h4>
                <p>{a.content}</p>
              </div>
            ))
          ) : (
            <p>No articles yet.</p>
          )}
        </motion.section>
      )}

      {currentUser && activeSection === "progress" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>My Progress 🌟</h2>
          {currentUser.joinedPrograms.length ? (
            currentUser.joinedPrograms.map((p, i) => (
              <div key={i} className="card">
                <h4>{p.name}</h4>
                <p>Status: {p.completed ? "✅ Completed" : "⏳ In Progress"}</p>
                {!p.completed && (
                  <button className="btn" onClick={() => completeProgram(p.name)}>Mark Completed</button>
                )}
              </div>
            ))
          ) : (
            <p>No sessions joined.</p>
          )}
        </motion.section>
      )}

      {currentUser && activeSection === "support" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Need Support? 💌</h2>
          <form onSubmit={handleSupport}>
            <textarea name="supportMessage" placeholder="Describe your concern..." required />
            <button type="submit">Submit</button>
          </form>
        </motion.section>
      )}

      {currentUser && activeSection === "chat" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2><FaRobot /> Chat with AI</h2>
          <div id="chatBox">
            <div id="chatMessages">
              {chatMessages.map((m, i) => (
                <div key={i} className={`msg ${m.type}`}>{m.text}</div>
              ))}
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </motion.section>
      )}

      {currentUser && currentUser.role === "admin" && activeSection === "admin" && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Admin Panel 🛠️</h2>

          <h3>Add Resource</h3>
          <form onSubmit={addResource}>
            <input type="text" name="resourceTitle" placeholder="Title" required />
            <select name="resourceCategory">
              <option value="Mental Health">Mental Health</option>
              <option value="Fitness">Fitness</option>
              <option value="Nutrition">Nutrition</option>
            </select>
            <textarea name="resourceDesc" placeholder="Description" required />
            <button type="submit">Add Resource</button>
          </form>

          <h3>Add Session</h3>
          <form onSubmit={addProgram}>
            <input type="text" name="programName" placeholder="Session Name" required />
            <input type="date" name="startDate" required />
            <textarea name="programDesc" placeholder="Description" required />
            <button type="submit">Add Session</button>
          </form>

          <h3>Add Article</h3>
          <form onSubmit={addArticle}>
            <input type="text" name="articleTitle" placeholder="Article Title" required />
            <textarea name="articleContent" placeholder="Article Content" required />
            <button type="submit">Publish Article</button>
          </form>

          <h3>Usage Metrics 📊</h3>
          <div id="metrics">
            <p><b>Total Resources:</b> {resources.length}</p>
            <p><b>Total Sessions:</b> {programs.length}</p>
            <p><b>Total Articles:</b> {articles.length}</p>
            <p><b>Total Support Requests:</b> {supportRequests.length}</p>
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default App;
