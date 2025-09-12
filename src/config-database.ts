import type { Database } from "bun:sqlite";

export default (db: Database) => {
  db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        time_added INTEGER,
        status TEXT,
        author TEXT,
        image TEXT,
        publication_date DATETIME,
        read_time INTEGER,
        description TEXT,
        favorite INTEGER
      )
  `);
  db.run(`
        CREATE TABLE IF NOT EXISTS tags (
          id   INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        );
  `);
  db.run(`
        CREATE TABLE IF NOT EXISTS articles_tags (
           article_id INTEGER NOT NULL,
           tag_id     INTEGER NOT NULL,
           PRIMARY KEY (article_id, tag_id),
           FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
           FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
  `);
};
