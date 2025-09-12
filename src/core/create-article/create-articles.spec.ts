import { Database } from "bun:sqlite";
import configDatabase from "../../config-database.ts";
import { createArticle } from "./create-articles.ts";

describe("Articles Router", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database(":memory:");
    configDatabase(db);
  });

  afterEach(() => {
    db.close();
  });

  it("should create registries in articles_tags and tags", async () => {
    createArticle(
      {
        title: `Article 1`,
        url: "/articles",
        tags: ["baz", "foo"],
      },
      db,
    );

    expect(db.query("select * from articles").all().length).toEqual(1);
    expect(db.query("select * from tags").all().length).toEqual(2);
    expect(db.query("select * from articles_tags").all().length).toEqual(2);
  });

  it("should not duplicate registries in tags when already exists", async () => {
    createArticle(
      {
        title: `Article 1`,
        url: "/articles1",
        tags: ["baz", "foo"],
      },
      db,
    );
    createArticle(
      {
        title: `Article 2`,
        url: "/articles2",
        tags: ["baz", "node"],
      },
      db,
    );
    expect(db.query("select * from articles").all().length).toEqual(2);
    expect(db.query("select * from tags").all().length).toEqual(3);
    expect(db.query("select * from articles_tags").all().length).toEqual(4);
  });
});
