import React, { Component } from "react";
import { QUESTIONS } from "./questions";

class App extends Component {
  state = {
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    showScore: false,
    averageScore: 0,
  };

  componentDidMount() {
    this.calculateAverageScore();
  }

  handleAnswer = (answer) => {
    this.setState((prevState) => {
      const updatedAnswers = [...prevState.answers, answer];
      const newIndex = prevState.currentQuestionIndex + 1;

      if (newIndex < Object.keys(QUESTIONS).length) {
        return {
          answers: updatedAnswers,
          currentQuestionIndex: newIndex,
        };
      } else {
        const score = (updatedAnswers.filter(a => a === 'yes').length / Object.keys(QUESTIONS).length) * 100;
        this.saveScore(score);
        this.calculateAverageScore();
        return {
          answers: updatedAnswers,
          score,
          showScore: true,
        };
      }
    });
  };

  saveScore = (score) => {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  calculateAverageScore = () => {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    if (scores.length > 0) {
      const averageScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
      this.setState({ averageScore });
    }
  };

  resetScores = () => {
    localStorage.removeItem('scores');
    this.setState({ averageScore: 0 });
    window.location.reload();
  };

  render() {
    const { currentQuestionIndex, showScore, score, averageScore } = this.state;
    const question = QUESTIONS[currentQuestionIndex + 1];

    return (
      <div className="main__wrap">
        <main className="container">
          {showScore ? (
            <div>
              <h1>Your Score: {score}%</h1>
              <h2>Average Score: {averageScore.toFixed(2)}%</h2>
              <button onClick={() => window.location.reload()}>Try Again</button>
              <button onClick={this.resetScores}>Reset Scores</button>
            </div>
          ) : (
            <div>
              <h1>{question}</h1>
              <button onClick={() => this.handleAnswer('yes')}>Yes</button>
              <button onClick={() => this.handleAnswer('no')}>No</button>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default App;
