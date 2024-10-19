import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, Button, Typography, Grid, FormControlLabel, 
  Checkbox, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { motion } from 'framer-motion';

const CompleteProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [occupation, setOccupation] = useState('');
  const [country, setCountry] = useState('');
  const [sourceOfIncome, setSourceOfIncome] = useState('');
  const [isCreditCardHolder, setIsCreditCardHolder] = useState(false);
  const [creditScore, setCreditScore] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("CompleteProfile component mounted");
    console.log("User ID:", userId);
    // Add any initialization logic here
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profile = {
      fullName,
      age: parseInt(age),
      dateOfBirth,
      occupation,
      country,
      sourceOfIncome,
      isCreditCardHolder,
      creditScore: parseInt(creditScore),
      monthlyIncome: parseFloat(monthlyIncome),
      monthlyExpenses: parseFloat(monthlyExpenses),
      financialGoals,
    };

    try {
      console.log(profile);
      const res = await fetch(`http://localhost:8000/api/complete-profile-info/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      console.log(res);
      const data = await res.json();
      setResponse(data);
      console.log('Document ID:', data.documentId);
      localStorage.setItem('hasFilledAdditionalInfo', 'true');
      navigate('/profile');
    } catch (error) {
      console.error('Error:', error);
      setResponse({ message: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Typography variant="h4" gutterBottom>Complete Your Profile</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Source of Income</InputLabel>
              <Select
                name="sourceOfIncome"
                value={sourceOfIncome}
                onChange={(e) => setSourceOfIncome(e.target.value)}
              >
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Investments">Investments</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCreditCardHolder}
                  onChange={(e) => setIsCreditCardHolder(e.target.checked)}
                  name="isCreditCardHolder"
                />
              }
              label="Are you a credit card holder?"
            />
          </Grid>
          {isCreditCardHolder && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Score"
                type="number"
                name="creditScore"
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Income"
              type="number"
              name="monthlyIncome"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Expenses"
              type="number"
              name="monthlyExpenses"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Financial Goals"
              multiline
              rows={4}
              name="financialGoals"
              value={financialGoals}
              onChange={(e) => setFinancialGoals(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Complete Profile'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {response && <div>{response.message}</div>}
    </motion.div>
  );
};

export default CompleteProfile;