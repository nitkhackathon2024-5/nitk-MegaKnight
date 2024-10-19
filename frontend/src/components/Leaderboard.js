import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, TrendingUp, School } from '@mui/icons-material';

const mockLeaderboardData = [
  { id: 1, name: 'John Doe', score: 1200, quizScore: 850, lessonsCompleted: 15, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', score: 1150, quizScore: 800, lessonsCompleted: 14, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Bob Johnson', score: 1100, quizScore: 750, lessonsCompleted: 13, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Alice Brown', score: 1050, quizScore: 700, lessonsCompleted: 12, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Charlie Davis', score: 1000, quizScore: 650, lessonsCompleted: 11, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Eva Wilson', score: 950, quizScore: 600, lessonsCompleted: 10, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Frank Miller', score: 900, quizScore: 550, lessonsCompleted: 9, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, name: 'Grace Lee', score: 850, quizScore: 500, lessonsCompleted: 8, avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, name: 'Henry Taylor', score: 800, quizScore: 450, lessonsCompleted: 7, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, name: 'Ivy Chen', score: 750, quizScore: 400, lessonsCompleted: 6, avatar: 'https://i.pravatar.cc/150?img=10' },
];

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setLeaderboardData(mockLeaderboardData);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getDataForTab = () => {
    switch (tabValue) {
      case 0:
        return leaderboardData.sort((a, b) => b.score - a.score);
      case 1:
        return leaderboardData.sort((a, b) => b.quizScore - a.quizScore);
      case 2:
        return leaderboardData.sort((a, b) => b.lessonsCompleted - a.lessonsCompleted);
      default:
        return leaderboardData;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Leaderboard</Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab icon={<EmojiEvents />} label="Overall" />
          <Tab icon={<TrendingUp />} label="Quiz Scores" />
          <Tab icon={<School />} label="Lessons Completed" />
        </Tabs>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">
                  {tabValue === 0 && 'Overall Score'}
                  {tabValue === 1 && 'Quiz Score'}
                  {tabValue === 2 && 'Lessons Completed'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getDataForTab().map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar alt={user.name} src={user.avatar} sx={{ mr: 2 }} />
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{user[getColumnForTab()]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </motion.div>
  );
};

const getColumnForTab = (tabValue) => {
  switch (tabValue) {
    case 0:
      return 'score';
    case 1:
      return 'quizScore';
    case 2:
      return 'lessonsCompleted';
    default:
      return 'score';
  }
};

export default Leaderboard;