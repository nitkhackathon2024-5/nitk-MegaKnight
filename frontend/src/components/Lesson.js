import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Lesson = () => {
  const { lessonTitle } = useParams(); // Capture the dynamic lesson title from the URL
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate(`/quiz/${encodeURIComponent(lessonTitle)}`);
  };

  return (
    <div className="lesson-container">
      <h1>{lessonTitle}</h1>
      <p>
        {/* Display lesson content dynamically */}
        This is the content for the {lessonTitle} lesson. Learn all about this topic before starting the quiz.
      </p>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
};

export default Lesson;