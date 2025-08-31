import type { Express } from "express";
import type { Database } from "bun:sqlite";
import {
  isArticleDtoCreateValid,
  isArticleDtoPatchValid,
  toResponseDto,
  tagsFromArticles,
} from "./articles.utils.ts";
import type { EntityArticle } from "./articles.types.ts";

export default (app: Express, db: Database) => {
  app.get("/tags", async (req, res) => {
    try {
      const stmt = db.query(`
              select tags from articles
              where tags IS NOT NULL
                and tags <> ''
              group by tags;
        `);
      const rows = stmt.all();
      res.json({
        tags: tagsFromArticles(rows as any),
      });
    } catch (e) {
      console.error(e);
      const message = "There was an internal error trying to list the tags";
      res.status(500).json({ message });
    }
  });

  app.get("/articles", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.size as string) || 10;

    let favorite = null;

    if (req.query.favorite === "false") {
      favorite = false;
    }
    if (req.query.favorite === "true") {
      favorite = true;
    }

    const order =
      req.query.order?.toString()?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const orderReadTime =
      req.query.orderTime?.toString()?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const tag = req.query.tag as string | null;
    const status = req.query.status as string | null;
    const offset = (page - 1) * limit;
    try {
      const stmt = db.query(`
            SELECT * FROM articles
                     where (? is null or tags like ?)
                     and (? is null or status = ?)
                     and (? is null or favorite = ?)
                     ORDER BY id ${order}, read_time ${orderReadTime}
                     LIMIT ? OFFSET ?
        `);
      const rows = stmt.all(
        tag,
        `%${tag}%`,
        status,
        status,
        favorite,
        favorite,
        limit,
        offset,
      );
      res.json({
        page,
        limit,
        data: (rows as EntityArticle[]).map(toResponseDto),
      });
    } catch (e) {
      console.error(e);
      const message = "There was an internal error trying to list the articles";
      res.status(500).json({ message });
    }
  });

  app.post("/articles", (req, res) => {
    const article = req.body;
    try {
      isArticleDtoCreateValid(article);
    } catch (e) {
      // @ts-ignore
      res.status(422).json(JSON.parse(e.message));
      return;
    }
    try {
      const stmt = db.query(`
            INSERT INTO articles (
                                  title,
                                  url,
                                  tags,
                                  status,
                                  author,
                                  image,
                                  publication_date,
                                  read_time,
                                  description,
                                  favorite
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
      const result = stmt.run(
        article.title,
        article.url,
        article.tags ?? null,
        article.status ?? "unread",
        article.author ?? null,
        article.image ?? null,
        article.publicationDate ?? null,
        article.readTime ?? null,
        article.description ?? null,
        article.favorite ?? null,
      );
      res.json({
        ...toResponseDto(article),
        id: result.lastInsertRowid,
      });
    } catch (e) {
      const message = "There was an internal error trying to insert article";
      res.status(500).json({ message });
    }
  });

  app.patch("/articles/:id", (req, res) => {
    const article = req.body;
    const id = req.params.id;
    try {
      isArticleDtoPatchValid(article);
    } catch (e) {
      // @ts-ignore
      res.status(422).send(JSON.parse(e.message));
      return;
    }

    const {
      title,
      url,
      tags,
      status,
      author,
      image,
      publication_date,
      read_time,
      description,
      favorite,
    } = article;

    try {
      let stmt;

      stmt = db.query(`
        UPDATE articles
        SET title = coalesce(?, title),
            url = coalesce(?, url),
            tags = coalesce(?, tags),
            status = coalesce(?, status),
            author = coalesce(?, author),
            image = coalesce(?, image),
            publication_date = coalesce(?, publication_date),
            read_time = coalesce(?, read_time),
            description = coalesce(?, description),
            favorite = coalesce(?, favorite)
        WHERE id = ?
      `);
      stmt.run(
        title,
        url,
        tags,
        status,
        author,
        image,
        publication_date,
        read_time,
        description,
        favorite,
        id,
      );
      stmt = db.query(`SELECT * FROM articles WHERE id = ?`).get(id);

      res.status(200).json(toResponseDto(stmt as EntityArticle));
    } catch (e) {
      const message =
        "There was an internal error trying to update the article";
      res.status(500).send({ message });
    }
  });

  app.delete("/articles/:id", (req, res) => {
    const id = req.params.id;
    try {
      db.query(`DELETE FROM articles WHERE id = ?`).run(id);
      res.status(200).end();
    } catch (e) {
      const message =
        "There was an internal error trying to delete the article";
      res.status(422).send({ message });
    }
  });
};
