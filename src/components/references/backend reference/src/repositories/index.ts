import pool from '../db/connection.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  display_name?: string | null;
  created_at: Date;
}

export interface Skill {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: Date;
  tags?: string[];
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  notes?: string | null;
  due_date?: Date | null;
  status: 'open' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: Date;
  updated_at: Date;
}

export interface Routine {
  id: number;
  user_id: number;
  title: string;
  schedule_type: 'daily' | 'weekly';
  weekdays?: string | string[] | null; // JSON in DB
  reminder_time?: string | null;
  created_at: Date;
}

export interface RoutineEntry {
  id: number;
  routine_id: number;
  date: Date;
  done: boolean;
  note?: string | null;
}

export interface Checkin {
  id: number;
  user_id: number;
  date: Date;
  mood: number;
  energy: number;
  note?: string | null;
  created_at: Date;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async create(user: Partial<User>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
      [user.email, user.password_hash, user.display_name]
    );
    return result.insertId;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, display_name, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }
}

export class SkillRepository {
  async getAll(category?: string, tag?: string): Promise<Skill[]> {
    let query = 'SELECT s.* FROM skills s';
    const params: any[] = [];

    if (tag) {
      query += ' JOIN skill_tags st ON s.id = st.skill_id JOIN tags t ON st.tag_id = t.id';
    }

    const conditions: string[] = [];
    if (category) {
      conditions.push('s.category = ?');
      params.push(category);
    }
    if (tag) {
      conditions.push('t.name = ?');
      params.push(tag);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Skill[];
  }

  async getOne(id: number): Promise<Skill | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM skills WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;

    const skill = rows[0] as Skill;
    const [tagRows] = await pool.query<RowDataPacket[]>(
      'SELECT t.name FROM tags t JOIN skill_tags st ON t.id = st.tag_id WHERE st.skill_id = ?',
      [id]
    );
    skill.tags = tagRows.map(row => row.name);
    return skill;
  }

  async create(skill: Partial<Skill>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO skills (title, description, category, difficulty) VALUES (?, ?, ?, ?)',
      [skill.title, skill.description, skill.category, skill.difficulty]
    );
    return result.insertId;
  }

  async update(id: number, skill: Partial<Skill>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE skills SET title = ?, description = ?, category = ?, difficulty = ? WHERE id = ?',
      [skill.title, skill.description, skill.category, skill.difficulty, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM skills WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

export class TodoRepository {
  async getAll(userId: number, status?: string): Promise<Todo[]> {
    let query = 'SELECT * FROM todos WHERE user_id = ?';
    const params: any[] = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Todo[];
  }

  async getOne(id: number, userId: number): Promise<Todo | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0 ? (rows[0] as Todo) : null;
  }

  async create(todo: Partial<Todo>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todos (user_id, title, notes, due_date, status, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [todo.user_id, todo.title, todo.notes, todo.due_date, todo.status || 'open', todo.priority || 'medium']
    );
    return result.insertId;
  }

  async update(id: number, userId: number, todo: Partial<Todo>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todos SET title = ?, notes = ?, due_date = ?, status = ?, priority = ? WHERE id = ? AND user_id = ?',
      [todo.title, todo.notes, todo.due_date, todo.status, todo.priority, id, userId]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}

export class RoutineRepository {
  async getAll(userId: number): Promise<Routine[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM routines WHERE user_id = ?',
      [userId]
    );
    return rows as Routine[];
  }

  async getOne(id: number, userId: number): Promise<Routine | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM routines WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0 ? (rows[0] as Routine) : null;
  }

  async create(routine: Partial<Routine>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO routines (user_id, title, schedule_type, weekdays, reminder_time) VALUES (?, ?, ?, ?, ?)',
      [routine.user_id, routine.title, routine.schedule_type, JSON.stringify(routine.weekdays), routine.reminder_time]
    );
    return result.insertId;
  }

  async update(id: number, userId: number, routine: Partial<Routine>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE routines SET title = ?, schedule_type = ?, weekdays = ?, reminder_time = ? WHERE id = ? AND user_id = ?',
      [routine.title, routine.schedule_type, JSON.stringify(routine.weekdays), routine.reminder_time, id, userId]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM routines WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  async complete(routineId: number, date: string, done: boolean, note?: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO routine_entries (routine_id, date, done, note) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE done = ?, note = ?',
      [routineId, date, done, note, done, note]
    );
    return result.insertId;
  }
}

export class CheckinRepository {
  async getAll(userId: number, from?: string, to?: string): Promise<Checkin[]> {
    let query = 'SELECT * FROM checkins WHERE user_id = ?';
    const params: any[] = [userId];

    if (from) {
      query += ' AND date >= ?';
      params.push(from);
    }
    if (to) {
      query += ' AND date <= ?';
      params.push(to);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Checkin[];
  }

  async getOne(id: number, userId: number): Promise<Checkin | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM checkins WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0 ? (rows[0] as Checkin) : null;
  }

  async create(checkin: Partial<Checkin>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO checkins (user_id, date, mood, energy, note) VALUES (?, ?, ?, ?, ?)',
      [checkin.user_id, checkin.date, checkin.mood, checkin.energy, checkin.note]
    );
    return result.insertId;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM checkins WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}
