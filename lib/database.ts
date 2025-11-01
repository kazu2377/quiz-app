import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'quiz.db');

export interface Question {
  id: number;
  question: string;
  options: string;
  correct_answer: number;
  category: string;
  difficulty: string;
}

export interface QuizResult {
  id: number;
  user_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.initDatabase();
  }

  private initDatabase(): void {
    this.db.serialize(() => {
      // Create questions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question TEXT NOT NULL,
          options TEXT NOT NULL,
          correct_answer INTEGER NOT NULL,
          category TEXT NOT NULL,
          difficulty TEXT NOT NULL
        )
      `);

      // Create quiz_results table with user_id
      this.db.run(`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating quiz_results table:', err);
        } else {
          console.log('quiz_results table created successfully');
          this.insertSampleQuestions();
        }
      });
    });
  }

  private insertSampleQuestions(): void {
    const sampleQuestions = [
      {
        question: '日本の首都はどこですか？',
        options: JSON.stringify(['大阪', '京都', '東京', '名古屋']),
        correct_answer: 2,
        category: '地理',
        difficulty: 'easy'
      },
      {
        question: '2 + 2 × 2 の計算結果は？',
        options: JSON.stringify(['6', '8', '4', '10']),
        correct_answer: 0,
        category: '数学',
        difficulty: 'easy'
      },
      {
        question: '水の化学式は何ですか？',
        options: JSON.stringify(['H2O', 'CO2', 'O2', 'N2']),
        correct_answer: 0,
        category: '科学',
        difficulty: 'easy'
      },
      {
        question: '世界で最も高い山は？',
        options: JSON.stringify(['富士山', 'エベレスト', 'K2', 'マッキンリー']),
        correct_answer: 1,
        category: '地理',
        difficulty: 'medium'
      },
      {
        question: '日本初の内閣総理大臣は？',
        options: JSON.stringify(['伊藤博文', '山県有朋', '桂太郎', '西園寺公望']),
        correct_answer: 0,
        category: '歴史',
        difficulty: 'medium'
      },
      {
        question: '光速は約何km/sですか？',
        options: JSON.stringify(['30万km/s', '20万km/s', '40万km/s', '10万km/s']),
        correct_answer: 0,
        category: '科学',
        difficulty: 'hard'
      },
      {
        question: 'JavaScriptが作られた年は？',
        options: JSON.stringify(['1995', '2000', '1990', '2005']),
        correct_answer: 0,
        category: '技術',
        difficulty: 'medium'
      },
      {
        question: '太陽系で最も大きな惑星は？',
        options: JSON.stringify(['地球', '火星', '木星', '土星']),
        correct_answer: 2,
        category: '科学',
        difficulty: 'easy'
      },
      {
        question: '日本の通貨単位は？',
        options: JSON.stringify(['円', 'ドル', 'ウォン', '元']),
        correct_answer: 0,
        category: '一般',
        difficulty: 'easy'
      },
      {
        question: '1年は何日ですか？（うるう年を除く）',
        options: JSON.stringify(['364日', '365日', '366日', '360日']),
        correct_answer: 1,
        category: '一般',
        difficulty: 'easy'
      },
      {
        question: '地球の衛星は何ですか？',
        options: JSON.stringify(['太陽', '月', '金星', '火星']),
        correct_answer: 1,
        category: '科学',
        difficulty: 'easy'
      },
      {
        question: '日本で最も長い川は？',
        options: JSON.stringify(['利根川', '信濃川', '石狩川', '淀川']),
        correct_answer: 1,
        category: '地理',
        difficulty: 'medium'
      },
      {
        question: 'HTMLは何の略称ですか？',
        options: JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language']),
        correct_answer: 0,
        category: '技術',
        difficulty: 'medium'
      },
      {
        question: '世界で最も人口の多い国は？',
        options: JSON.stringify(['インド', '中国', 'アメリカ', 'インドネシア']),
        correct_answer: 0,
        category: '地理',
        difficulty: 'medium'
      },
      {
        question: '円周率は約いくつですか？',
        options: JSON.stringify(['3.14', '2.71', '1.41', '1.73']),
        correct_answer: 0,
        category: '数学',
        difficulty: 'easy'
      },
      {
        question: '日本の国旗は何と呼ばれますか？',
        options: JSON.stringify(['日章旗', '日の丸旗', '旭日旗', '桜旗']),
        correct_answer: 0,
        category: '一般',
        difficulty: 'medium'
      },
      {
        question: '五輪の色はいくつありますか？',
        options: JSON.stringify(['5色', '6色', '7色', '4色']),
        correct_answer: 0,
        category: '一般',
        difficulty: 'easy'
      },
      {
        question: '日本で最も面積の大きい都道府県は？',
        options: JSON.stringify(['北海道', '岩手県', '長野県', '新潟県']),
        correct_answer: 0,
        category: '地理',
        difficulty: 'medium'
      }
    ];

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO questions (question, options, correct_answer, category, difficulty)
      VALUES (?, ?, ?, ?, ?)
    `);

    sampleQuestions.forEach(q => {
      stmt.run(q.question, q.options, q.correct_answer, q.category, q.difficulty);
    });

    stmt.finalize();
  }

  async getQuestions(category?: string, difficulty?: string, limit: number = 10): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM questions';
      const params: any[] = [];

      if (category || difficulty) {
        query += ' WHERE';
        const conditions: string[] = [];

        if (category) {
          conditions.push(' category = ?');
          params.push(category);
        }

        if (difficulty) {
          conditions.push(' difficulty = ?');
          params.push(difficulty);
        }

        query += conditions.join(' AND');
      }

      query += ' ORDER BY RANDOM() LIMIT ?';
      params.push(limit);

      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Question[]);
        }
      });
    });
  }

  async getCategories(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT DISTINCT category FROM questions', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => (row as any).category));
        }
      });
    });
  }

  async saveQuizResult(userId: string, score: number, totalQuestions: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO quiz_results (user_id, score, total_questions) VALUES (?, ?, ?)',
        [userId, score, totalQuestions],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getQuizResults(userId?: string): Promise<QuizResult[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM quiz_results';
      const params: any[] = [];

      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      }

      query += ' ORDER BY completed_at DESC LIMIT 50';

      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as QuizResult[]);
        }
      });
    });
  }

  async createQuestion(question: string, options: string, correctAnswer: number, category: string, difficulty: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO questions (question, options, correct_answer, category, difficulty) VALUES (?, ?, ?, ?, ?)',
        [question, options, correctAnswer, category, difficulty],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async deleteQuestion(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM questions WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  close(): void {
    this.db.close();
  }
}

export const db = new Database();
