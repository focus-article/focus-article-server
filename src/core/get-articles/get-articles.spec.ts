import { Database } from "bun:sqlite";
import configDatabase from "../../config-database.ts";
import { getArticles } from "./get-articles.ts";
import { createArticle } from "../create-article/create-articles.ts";

describe("get-articles", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database(":memory:");
    configDatabase(db);
  });

  afterEach(() => {
    db.close();
  });

  describe("When tag filter is provided", () => {
    beforeEach(() => {
      createArticle(
        {
          tags: ["teste"],
          url: "url1",
          title: "title 1",
        },
        db,
      );
      createArticle(
        {
          tags: ["teste", "mathias"],
          url: "url2",
          title: "title 2",
        },
        db,
      );
      createArticle(
        {
          tags: ["teste", "mathias", "ferias"],
          url: "url3",
          title: "title 3",
        },
        db,
      );
      createArticle(
        {
          url: "url4",
          title: "title 4",
        },
        db,
      );
    });

    it("should return article with tag", async () => {
      const result = getArticles(
        {
          tags: ["ferias"],
        } as any,
        db,
      );
      expect(result?.length).toEqual(1);
    });

    it("should return two article", async () => {
      const result = getArticles(
        {
          tags: ["teste", "mathias"],
        } as any,
        db,
      );
      expect(result?.length).toEqual(2);
    });

    it("should return three articles", async () => {
      const result = getArticles(
        {
          tags: ["teste"],
        } as any,
        db,
      );
      expect(result?.length).toEqual(3);
    });

    it("should return all articles when nothing is provided", async () => {
      const result = getArticles({} as any, db);
      expect(result?.length).toEqual(4);
    });
  });

  it("should return the unread article", async () => {
    createArticle(
      {
        url: "url1",
        title: "title 1",
        status: "unread",
      },
      db,
    );
    createArticle(
      {
        url: "url1",
        title: "title 2",
        status: "read",
      },
      db,
    );
    const result = getArticles(
      {
        status: "unread",
        tags: [],
      } as any,
      db,
    );
    expect(result?.length).toEqual(1);
    expect(result[0].title).toEqual("title 1");
  });
});
