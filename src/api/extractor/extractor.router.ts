import type { Express } from "express";
import { getArticleMetaData } from "article-metadata-extractor";

export default (app: Express) => {
  app.get("/extractor", (req, res) => {
    const { query } = req;
    if (!query?.url) {
      const error = "Should defined query params url";
      return res.status(400).send({ error });
    }
    getArticleMetaData(query.url as string)
      .then((data) => res.json({ ...data, url: query.url }))
      .catch((error) => res.status(500).send({ error }));
  });
};
