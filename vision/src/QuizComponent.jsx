import React, { useState } from "react";
import "./quiz.css";

export default function QuizComponent() {
  const questions = [
    {
      q: "What is the best way to reduce exam stress?",
      options: ["Cram more", "Mindful breathing", "Skip sleep", "Overthink everything"],
      answer: 1
    },
    {
      q: "How many hours of sleep should a student get?",
      options: ["3–4", "5–6", "7–9", "10–12"],
      answer: 2
    },
    {
      q: "Which habit improves mental well-being?",
      options: ["Scrolling all night", "Balanced diet", "Stressing intentionally", "Skipping breakfast"],
      answer: 1
    }
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  const nextQuestion = () => {
    if (selected === current.answer) {
      setScore(score + 1);
    }

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card fade-in">

        {!finished ? (
          <>
            <div className="quiz-progress">
              <div
                className="quiz-progress-bar"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h2 className="quiz-question">{current.q}</h2>

            <div className="quiz-options">
              {current.options.map((opt, i) => (
                <div
                  key={i}
                  className={`quiz-option ${selected === i ? "active" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  {opt}
                </div>
              ))}
            </div>

            <button
              className="quiz-btn"
              disabled={selected === null}
              onClick={nextQuestion}
            >
              {index + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </>
        ) : (
          <div className="quiz-result fade-in">
            <h2>🎉 Quiz Completed!</h2>
            <p>Your Score: {score} / {questions.length}</p>

            <button className="restart-btn" onClick={restartQuiz}>
              Restart Quiz
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
