const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tw_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).send('Error fetching tasks');
      return;
    }
    res.json(results);
  });
});

app.post('/tasks', (req, res) => {
  const { category_id, task_description } = req.body;
  db.query('INSERT INTO tasks (category_id, task_description) VALUES (?, ?)', [category_id, task_description], (err, results) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).send('Error adding task');
      return;
    }
    const newTask = { id: results.insertId, category_id, task_description };
    io.emit('newTask', newTask);
    res.status(201).json(newTask);
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).send('Error deleting task');
      return;
    }
    io.emit('deleteTask', id);
    res.send('Task deleted');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
