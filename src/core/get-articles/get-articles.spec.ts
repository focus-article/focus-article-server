import { Database } from "bun:sqlite";
import configDatabase from "../../config-database.ts";
import { getArticles } from "./get-articles.ts";
import { createArticle } from "../create-article/create-articles.ts";

describe("Articles Router", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database(":memory:");
    configDatabase(db);
  });

  afterEach(() => {
    db.close();
  });
});
