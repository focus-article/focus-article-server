import { Database } from "bun:sqlite";
import configDatabase from "../../config-database.ts";
import { createArticle } from "../create-article/create-articles.ts";
import { updateArticle } from "./update-article.ts";

describe("Articles Router", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database(":memory:");
    configDatabase(db);
  });

  afterEach(() => {
    db.close();
  });

  it("should update article", async () => {
    createArticle(
      {
        title: `Article 1`,
        url: "/articles",
        tags: ["baz", "foo"],
      },
      db,
    );
    updateArticle(
      {
        id: 1,
        title: "Article updated",
      },
      db,
    );
    expect(db.query("select title from articles where id = 1").get()).toEqual({
      title: "Article updated",
    });
  });

  it("should create two lines in articles_tags and tags", async () => {
    createArticle(
      {
        title: `Article 1`,
        url: "/articles",
        tags: ["baz", "foo"],
      },
      db,
    );
    expect(db.query("select * from articles_tags").all().length).toEqual(2);
    expect(db.query("select * from tags").all().length).toEqual(2);
  });

  it("should update to one line in articles_tags and keep one in tags", async () => {
    createArticle(
      {
        title: `Article 1`,
        url: "/articles",
        tags: ["baz", "foo"],
      },
      db,
    );
    updateArticle(
      {
        id: 1,
        title: "Article updated",
        tags: ["baz"],
      },
      db,
    );

    expect(db.query("select * from articles_tags").all().length).toEqual(1);
    expect(db.query("select * from tags").all().length).toEqual(2);
  });
});
