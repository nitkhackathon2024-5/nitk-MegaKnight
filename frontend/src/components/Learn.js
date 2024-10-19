import React, { useState } from 'react';
import { Typography, Button, TextField, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const FormattedText = ({ text }) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    if (line.startsWith('## ')) {
      return <Typography key={index} variant="h4" gutterBottom>{line.slice(3)}</Typography>;
    } else if (line.startsWith('**')) {
      return <Typography key={index} variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>{line.replace(/\*\*/g, '')}</Typography>;
    } else if (line.startsWith('* ')) {
      return <Typography key={index} variant="body1" style={{ marginLeft: '1em', marginBottom: '0.5em' }}>• {line.slice(2)}</Typography>;
    } else {
      return <Typography key={index} variant="body1" paragraph>{line}</Typography>;
    }
  });
};

const Learn = () => {
  const [topic, setTopic] = useState('');
  const [lessonData, setLessonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found in local storage');
      setIsLoading(false);
      return;
    }

    try {
      // Store topic in Firestore
      await fetch(`http://localhost:8000/api/store-topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, topic }),
      });

      // Fetch age from API
      const ageResponse = await fetch(`http://localhost:8000/api/get-age/${userId}`);
      const ageData = await ageResponse.json();
      const age = ageData.age;

      // Generate lessons
      const response = await fetch('http://localhost:8000/generate_lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, age }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const lessonResponse = await response.json();
      setLessonData(lessonResponse);
    } catch (error) {
      console.error('Error during lesson generation:', error);
      alert('An error occurred while generating lessons. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '2rem' }}
    >
      <Typography variant="h3" gutterBottom>
        Financial Lessons
      </Typography>
      <Typography variant="body1" paragraph>
        Explore our curated lessons to enhance your financial knowledge.
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          label="Enter Topic"
          variant="outlined"
          fullWidth
          value={topic}
          onChange={handleTopicChange}
          style={{ marginBottom: '1rem' }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Lessons'}
        </Button>
      </form>
      {lessonData && (
        <Paper elevation={3} style={{ marginTop: '2rem', padding: '1rem' }}>
          <Typography variant="h4" gutterBottom>
            Lesson Content:
          </Typography>
          <Typography variant="h5" gutterBottom>
            Subtopics:
          </Typography>
          <List>
            {lessonData.subtopics.map((subtopic, index) => (
              <ListItem key={index}>
                <ListItemText primary={<FormattedText text={subtopic} />} />
              </ListItem>
            ))}
          </List>
          <Divider style={{ margin: '1rem 0' }} />
          <Typography variant="h5" gutterBottom>
            Complete Lesson:
          </Typography>
          <FormattedText text={lessonData.complete_lesson} />
        </Paper>
      )}
    </motion.div>
  );
};

export default Learn;