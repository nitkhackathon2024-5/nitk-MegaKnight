import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, LinearProgress, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const questions = [
  {
    question: "What is the primary purpose of a budget?",
    options: [
      "To restrict spending",
      "To track income and expenses",
      "To increase debt",
      "To reduce savings"
    ],
    correctAnswer: 1
  },
  {
    question: "Which of the following is considered a liquid asset?",
    
    options: [
      "A house",
      "A car",
      "Stocks",
      "Cash in a savings account"
    ],
    correctAnswer: 3
  },
  {
    question: "What does diversification in investing mean?",
    options: [
      "Putting all your money in one stock",
      "Spreading investments across various assets",
      "Only investing in bonds",
      "Avoiding the stock market"
    ],
    correctAnswer: 1
  },
  // Add more questions here
];

const Game = () => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 10);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      }, 1000);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setGameOver(false);
    setTimeLeft(60);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Finance Quiz Game</Typography>
          {!gameOver ? (
            <>
              <LinearProgress variant="determinate" value={(timeLeft / 60) * 100} style={{ marginBottom: '20px' }} />
              <Typography variant="body1">Time left: {timeLeft} seconds</Typography>
              <Typography variant="h6">Score: {score}</Typography>
              <Typography variant="h5" style={{ marginTop: '20px', marginBottom: '20px' }}>
                {questions[currentQuestion].question}
              </Typography>
              <Grid container spacing={2}>
                {questions[currentQuestion].options.map((option, index) => (
                  <Grid item xs={12} key={index}>
                    <Button
                      fullWidth
                      variant={selectedAnswer === index ? "contained" : "outlined"}
                      color={selectedAnswer === index ? "secondary" : "primary"}
                      onClick={() => handleAnswer(index)}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" gutterBottom>Game Over!</Typography>
              <Typography variant="h5">Your final score: {score}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={resetGame}
                style={{ marginTop: '20px' }}
              >
                Play Again
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Game;