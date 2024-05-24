import React, { useState, useEffect } from "react";
import { QUESTIONS } from "./questions";

const App = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    calculateAverageScore();
  }, []);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers, answer];
    const newIndex = currentQuestionIndex + 1;

    if (newIndex < Object.keys(QUESTIONS).length) {
      setAnswers(updatedAnswers);
      setCurrentQuestionIndex(newIndex);
    } else {
      const score = (updatedAnswers.filter(a => a === 'yes').length / Object.keys(QUESTIONS).length) * 100;
      saveScore(score);
      setScore(score);
      setShowScore(true);
      calculateAverageScore();
    }
  };

  const saveScore = (score) => {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  const calculateAverageScore = () => {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    if (scores.length > 0) {
      const averageScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
      setAverageScore(averageScore);
    }
  };

  const resetScores = () => {
    localStorage.removeItem('scores');
    setAverageScore(0);
    window.location.reload();
  };

  const question = QUESTIONS[currentQuestionIndex + 1];

  return (
    <div className="main__wrap">
      <main className="container">
        {showScore ? (
          <div>
            <h1>Your Score: {score}%</h1>
            <h2>Average Score: {averageScore.toFixed(2)}%</h2>
            <button onClick={() => window.location.reload()}>Try Again</button>
            <button onClick={resetScores}>Reset Scores</button>
          </div>
        ) : (
          <div>
            <h1>{question}</h1>
            <button onClick={() => handleAnswer('yes')}>Yes</button>
            <button onClick={() => handleAnswer('no')}>No</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
