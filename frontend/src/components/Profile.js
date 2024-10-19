import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Switch, FormControlLabel, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const Profile = () => {
  const [lessonsCompleted, setLessonsCompleted] = useState(['Budgeting Basics', 'Investing 101']);
  const [isParent, setIsParent] = useState(false);
  const [childAccounts, setChildAccounts] = useState([
    { name: 'Child 1', lessonsCompleted: 3, totalScore: 150 },
    { name: 'Child 2', lessonsCompleted: 2, totalScore: 100 },
  ]);
  const navigate = useNavigate();

  const handleExpenseTrackerClick = () => {
    navigate('/expense-tracker');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom>Welcome, User's Name</Typography>
      
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Your Progress</Typography>
          <Typography variant="body1">Lessons Completed: {lessonsCompleted.length}</Typography>
          <ul>
            {lessonsCompleted.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
          <Button variant="contained" color="primary" onClick={handleExpenseTrackerClick}>
            Expense Tracker
          </Button>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Account Type</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isParent}
                onChange={(e) => setIsParent(e.target.checked)}
                color="primary"
              />
            }
            label="Parent Account"
          />
        </CardContent>
      </Card>

      {isParent && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Child Accounts</Typography>
            <Grid container spacing={2}>
              {childAccounts.map((child, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{child.name}</Typography>
                      <Typography variant="body2">Lessons Completed: {child.lessonsCompleted}</Typography>
                      <Typography variant="body2">Total Score: {child.totalScore}</Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/child-expense-tracker/${index}`)}
                        style={{ marginTop: '10px' }}
                      >
                        View Expense Tracker
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Profile;