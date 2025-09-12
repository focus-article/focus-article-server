import { Database } from "bun:sqlite";
import configDatabase from "../../config-database.ts";
import { createArticle } from "../create-article/create-articles.ts";
import { getArticle } from "./get-article.ts";

describe("Articles Router", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database(":memory:");
    configDatabase(db);
  });

  afterEach(() => {
    db.close();
  });

  it("should retorn the tags", async () => {
    createArticle(
      {
        title: `Article 1`,
        url: "/articles",
        tags: ["baz", "foo"],
      },
      db,
    );
    expect(getArticle(1, db).tags).toEqual(["baz", "foo"]);
  });
});
