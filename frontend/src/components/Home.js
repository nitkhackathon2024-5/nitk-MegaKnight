import React from 'react';
import { Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, School, EmojiEvents, AttachMoney } from '@mui/icons-material';

const Home = () => {
  const features = [
    { title: 'Learn Finance', icon: <School />, link: '/learn', description: 'Interactive lessons on personal finance' },
    { title: 'Play & Earn', icon: <EmojiEvents />, link: '/game', description: 'Test your knowledge and climb the leaderboard' },
    { title: 'Track Expenses', icon: <AttachMoney />, link: '/expense-tracker', description: 'Manage your income and expenses' },
    { title: 'View Progress', icon: <TrendingUp />, link: '/profile', description: 'See your financial growth over time' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={4} style={{ padding: '2rem' }}>
        <Grid item xs={12}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Financial Literacy
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your journey to financial freedom starts here
          </Typography>
        </Grid>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card>
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to={feature.link} color="primary">
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Financial literacy is crucial for making informed decisions about your money. 
            Our app provides you with the knowledge and tools to take control of your finances.
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/learn" size="large">
            Start Learning Now
          </Button>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Home;