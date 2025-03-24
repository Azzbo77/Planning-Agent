const express = require('express');
const Database = require('better-sqlite3');
const app = express();
app.use(express.json());
const db = new Database('/app/data/planner.db', { verbose: console.log });
db.exec(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    duration INTEGER,
    approved INTEGER DEFAULT 0,
    description TEXT,
    project TEXT,
    recurrence TEXT DEFAULT 'none'
)`);

app.get('/events', (req, res) => {
    const { project } = req.query;
    const stmt = project ? 'SELECT * FROM events WHERE project = ?' : 'SELECT * FROM events';
    const events = db.prepare(stmt).all(project || undefined);
    res.json(events);
});

app.post('/events', (req, res) => {
    const { event_name, start_time, duration, approved, description, project } = req.body;
    const stmt = db.prepare('INSERT INTO events (event_name, start_time, duration, approved, description, project) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(event_name, start_time, duration || 30, approved ? 1 : 0, description, project);
    res.json({ id: info.lastInsertRowid, ...req.body });
});

app.delete('/events/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(req.params.id);
    res.json(info.changes ? { message: 'Deleted' } : { message: 'Not found' });
});

app.patch('/events/:id', (req, res) => {
    const { approved } = req.body;
    const stmt = db.prepare('UPDATE events SET approved = ? WHERE id = ?');
    const info = stmt.run(approved ? 1 : 0, req.params.id);
    res.json(info.changes ? { message: 'Updated' } : { message: 'Not found' });
});

app.listen(8090, '0.0.0.0', () => console.log('Planner API online at :8090'));
