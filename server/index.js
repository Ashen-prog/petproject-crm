const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Low, JSONFile } = require('lowdb');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile('server/db.json');
const db = new Low(adapter);

db.data = db.data || { users: [], records: [], employees: [] };

const SECRET = 'crm-secret';

async function initDB() {
  await db.read();
  db.data = db.data || { users: [], records: [], employees: [] };
  await db.write();
}

initDB();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/api/register', async (req, res) => {
  await db.read();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Invalid data' });
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: 'User exists' });
  const hash = bcrypt.hashSync(password, 10);
  const user = { id: uuidv4(), email, password: hash };
  db.data.users.push(user);
  await db.write();
  res.json({ message: 'ok' });
});

app.post('/api/login', async (req, res) => {
  await db.read();
  const { email, password } = req.body;
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/records', authMiddleware, async (req, res) => {
  await db.read();
  res.json(db.data.records);
});

app.post('/api/records', authMiddleware, async (req, res) => {
  await db.read();
  const record = { id: uuidv4(), ...req.body };
  db.data.records.push(record);
  await db.write();
  res.json(record);
});

app.put('/api/records/:id', authMiddleware, async (req, res) => {
  await db.read();
  const idx = db.data.records.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.data.records[idx] = { ...db.data.records[idx], ...req.body };
  await db.write();
  res.json(db.data.records[idx]);
});

app.delete('/api/records/:id', authMiddleware, async (req, res) => {
  await db.read();
  db.data.records = db.data.records.filter(r => r.id !== req.params.id);
  await db.write();
  res.json({});
});

app.get('/api/employees', authMiddleware, async (req, res) => {
  await db.read();
  res.json(db.data.employees);
});

app.post('/api/employees', authMiddleware, async (req, res) => {
  await db.read();
  const employee = { id: uuidv4(), ...req.body };
  db.data.employees.push(employee);
  await db.write();
  res.json(employee);
});

app.delete('/api/employees/:id', authMiddleware, async (req, res) => {
  await db.read();
  db.data.employees = db.data.employees.filter(e => e.id !== req.params.id);
  await db.write();
  res.json({});
});

app.listen(4000, () => console.log('Server running on port 4000'));
