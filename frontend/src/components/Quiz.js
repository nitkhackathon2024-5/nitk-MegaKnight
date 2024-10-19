import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const { lessonTitle } = useParams();
  const [questions] = useState([
    // Dummy data for questions (To be fetched dynamically)
    { question: "What is budgeting?", options: ["Saving", "Planning", "Spending", "Investing"], correct: 1 },
    { question: "What is a stock?", options: ["Ownership", "Debt", "Savings", "Bond"], correct: 0 },
    // Add more questions as needed
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      if (selectedOption === questions[currentQuestion].correct) {
        setScore((prevScore) => prevScore + 1);
      }
      setSelectedOption(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setQuizCompleted(true);
        setTimeTaken(timer);
      }
    }
  };

  return (
    <div className="quiz-container">
      <h1>Quiz for {lessonTitle}</h1>
      {!quizCompleted ? (
        <>
          <p>Time: {timer} seconds</p>
          <p>{questions[currentQuestion].question}</p>
          <ul>
            {questions[currentQuestion].options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionSelect(index)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedOption === index ? 'lightblue' : 'white',
                }}
              >
                {option}
              </li>
            ))}
          </ul>
          <button onClick={handleNextQuestion}>Next</button>
        </>
      ) : (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} / {questions.length}</p>
          <p>Time taken: {timeTaken} seconds</p>
          {/* TODO: Save score and time to the leaderboard */}
        </div>
      )}
    </div>
  );
};

export default Quiz;