import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Grid, Card, CardContent, LinearProgress, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseTracker = () => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [budget, setBudget] = useState(1000);
  const [savingsGoal, setSavingsGoal] = useState(500);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    setExpenses(savedExpenses);
    calculateSums(savedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const calculateSums = (expenseList) => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    expenseList.forEach(item => {
      if (item.type === 'Income') {
        incomeTotal += parseFloat(item.amount);
      } else {
        expenseTotal += parseFloat(item.amount);
      }
    });
    setIncomeSum(incomeTotal);
    setExpenseSum(expenseTotal);
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (description && type && category && amount) {
      const newExpense = { description, type, category, amount: parseFloat(amount), date: new Date().toISOString() };
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      calculateSums(updatedExpenses);
      setDescription('');
      setType('');
      setCategory('');
      setAmount('');
    }
  };

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [incomeSum, expenseSum],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Expense Tracker</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Add New Entry</Typography>
              <form onSubmit={handleAddEntry}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                  displayEmpty
                  margin="dense"
                  required
                >
                  <MenuItem value="" disabled>Select Type</MenuItem>
                  <MenuItem value="Income">Income</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
                </Select>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  fullWidth
                  displayEmpty
                  margin="dense"
                  required
                >
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Transportation">Transportation</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Salary">Salary</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Add Entry
                </Button>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Income vs Expenses</Typography>
              <Bar data={data} options={options} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Income</Typography>
                <Typography variant="h4" color="primary">₹{incomeSum.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Expenses</Typography>
                <Typography variant="h4" color="error">₹{expenseSum.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Balance</Typography>
                <Typography variant="h4" color={incomeSum - expenseSum >= 0 ? "success" : "error"}>
                  ₹{(incomeSum - expenseSum).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Budget Progress</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(expenseSum / budget) * 100} 
                color={expenseSum <= budget ? "primary" : "secondary"}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">₹{expenseSum.toFixed(2)}</Typography>
                <Typography variant="body2">₹{budget.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Savings Goal Progress</Typography>
              <LinearProgress 
                variant="determinate" 
                value={((incomeSum - expenseSum) / savingsGoal) * 100} 
                color="primary"
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">₹{(incomeSum - expenseSum > 0 ? incomeSum - expenseSum : 0).toFixed(2)}</Typography>
                <Typography variant="body2">₹{savingsGoal.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.slice(-5).reverse().map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          {expense.type === 'Income' ? (
                            <AddCircleOutline sx={{ color: 'success.main', mr: 1 }} />
                          ) : (
                            <RemoveCircleOutline sx={{ color: 'error.main', mr: 1 }} />
                          )}
                          ₹{expense.amount.toFixed(2)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default ExpenseTracker;