const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Additional settings depending on your environment
});

app.get('/', (req, res) => {
  res.send('Welcome to Echo homes!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Here, you'd check the credentials against a database or other service
  if (email === 'yaswini.ranga@gmail.com' && password === 'Pass12') {
      res.json({ message: 'Login Successful!' });
  } else {
      res.status(401).json({ message: 'Invalid credentials' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

