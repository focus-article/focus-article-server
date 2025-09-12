import type { Express } from "express";
import type { Database } from "bun:sqlite";
import {
  isArticleDtoCreateValid,
  isArticleDtoPatchValid,
  toResponseDto,
  tagsFromArticles,
} from "./articles.utils.ts";
import type { EntityArticle } from "./articles.types.ts";
import { getArticles } from "../../core/get-articles/get-articles.ts";
import { createArticle } from "../../core/create-article/create-articles.ts";
import { updateArticle } from "../../core/update-article/update-article.ts";
import { getArticle } from "../../core/get-article/get-article.ts";
import { deleteArticle } from "../../core/delete-article/delete-article.ts";
import { getTags } from "../../core/get-tags/get-tags.ts";

export default (app: Express, db: Database) => {
  app.get("/tags", async (req, res) => {
    try {
      res.json({
        tags: getTags(db),
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

    try {
      const rows = getArticles(
        {
          page,
          limit,
          order,
          orderReadTime,
          tag,
          status,
          favorite,
        },
        db,
      );
      res.json({
        page,
        limit,
        data: {
          articles: (rows as EntityArticle[]).map(toResponseDto),
          tags: getTags(db),
        },
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
      const result = createArticle(article, db);
      res.json({
        ...toResponseDto(article),
        id: result.lastInsertRowid,
      });
    } catch (e) {
      console.error(e);
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

    try {
      let stmt;
      updateArticle({ ...article, id }, db);
      stmt = getArticle(+id, db);

      res.status(200).json(toResponseDto(stmt as EntityArticle));
    } catch (e) {
      console.error(e);
      const message =
        "There was an internal error trying to update the article";
      res.status(500).send({ message });
    }
  });

  app.delete("/articles/:id", (req, res) => {
    const id = req.params.id;
    try {
      deleteArticle(id, db);
      res.status(200).end();
    } catch (e) {
      const message =
        "There was an internal error trying to delete the article";
      res.status(422).send({ message });
    }
  });
};
