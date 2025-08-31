import { Database } from "bun:sqlite";
import router from "./articles.router.ts";
import express from "express";
import type { Express } from "express";
import supertest from "supertest";
import configDatabase from "../../config-database.ts";

describe("Articles Router", () => {
  let app: Express;
  let db: Database;

  beforeEach(() => {
    db = new Database(":memory:");
    app = express();
    app.use(express.json());
    router(app, db);
    configDatabase(db);
  });

  afterEach(() => {
    db.close();
  });

  function addArticle(payload: any) {
    return supertest(app).post("/articles").send(payload).expect(200);
  }

  function getAllArticles() {
    return db.query("SELECT * FROM articles").all();
  }

  async function addArticles(quantidade: number) {
    for (const i of Array(quantidade).keys()) {
      await addArticle({
        title: `Article ${i}`,
        url: "/articles",
        tags: "baz",
      });
    }
  }

  describe("GET /articles", () => {
    it("should return when tag is provided", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "baz",
      });
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "foo",
      });
      const res = await supertest(app).get("/articles?tag=baz").expect(200);
      expect(res.body.data.length).toBe(1);
    });

    it("should return when status is provided", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        status: "unread",
      });
      await addArticle({
        title: "Article 2",
        url: "/articles",
        status: "read",
      });
      const res = await supertest(app).get("/articles?status=read").expect(200);
      expect(res.body.data.length).toBe(1);
    });

    it("should return just one item when size 1 is provided", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "baz",
      });
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "foo",
      });
      let res;

      res = await supertest(app).get("/articles").expect(200);

      expect(res.body.data.length).toBe(2);

      res = await supertest(app).get("/articles?size=1").expect(200);

      expect(res.body.data.length).toBe(1);
    });

    it("Should return 10 itens by default", async () => {
      await addArticles(11);
      const res = await supertest(app).get("/articles").expect(200);
      expect(res.body.data.length).toBe(10);
    });

    it("Should return 5 itens when defined", async () => {
      await addArticles(11);
      const res = await supertest(app).get("/articles?size=5").expect(200);
      expect(res.body.data.length).toBe(5);
    });

    it("Should return 1 item for page 3 when 11 are persited", async () => {
      await addArticles(11);
      const res = await supertest(app)
        .get("/articles?size=5&page=3")
        .expect(200);
      expect(res.body.data.length).toBe(1);
    });

    it("Should return all items", async () => {
      await addArticles(11);
      const res = await supertest(app).get("/articles?size=-1").expect(200);
      expect(res.body.data.length).toBe(11);
    });

    it("Should return all itens in DESC order by default", async () => {
      await addArticles(3);
      const res = await supertest(app).get("/articles").expect(200);
      expect(res.body.data[0].title).toBe("Article 2");
      expect(res.body.data[1].title).toBe("Article 1");
      expect(res.body.data[2].title).toBe("Article 0");
    });

    it("Should return all itens in ASC when defined", async () => {
      await addArticles(3);
      const res = await supertest(app).get("/articles?order=asc").expect(200);
      expect(res.body.data[0].title).toBe("Article 0");
      expect(res.body.data[1].title).toBe("Article 1");
      expect(res.body.data[2].title).toBe("Article 2");
    });

    it("Should return only favorite", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        favorite: true,
      });
      await addArticle({
        title: "Article 2",
        url: "/articles",
        favorite: false,
      });
      const res = await supertest(app)
        .get("/articles?favorite=true")
        .expect(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].favorite).toBe(true);
      expect(res.body.data[0].title).toBe("Article 1");
    });

    it("Should return only not favorite", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        favorite: true,
      });
      await addArticle({
        title: "Article 2",
        url: "/articles",
        favorite: false,
      });
      const res = await supertest(app)
        .get("/articles?favorite=false")
        .expect(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].favorite).toBe(false);
      expect(res.body.data[0].title).toBe("Article 2");
    });

    it("should return both articles if favorite is not defined", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        favorite: true,
      });
      await addArticle({
        title: "Article 2",
        url: "/articles",
        favorite: false,
      });
      const res = await supertest(app).get("/articles").expect(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe("GET /tags", () => {
    it("Should return an array of tags", async () => {
      await addArticle({
        title: "Article 1",
        url: "/article1",
        tags: "Node|ypescript",
      });
      await addArticle({
        title: "Article 2",
        url: "/article2",
        tags: "ai|node",
      });
      const res = await supertest(app).get("/tags").expect(200);
      expect(res.body.tags.length).toBe(3);
    });
  });

  describe("POST /articles", () => {
    it("should create the article", async () => {
      const payload = {
        title: "Teste",
        url: "http://exemplo.com",
      };
      const res = await addArticle(payload);

      expect(res.body.title).toBe(payload.title);

      const row = getAllArticles();

      expect(res.status).toBe(200);
      expect(row.length).toBe(1);
      // @ts-ignore
      expect(row[0].title).toBe(payload.title);
      // @ts-ignore
      expect(row[0].url).toBe(payload.url);
    });

    it("should not create if title is not provided", async () => {
      const payload = {
        url: "http://exemplo.com",
      };

      const res = await supertest(app).post("/articles").send(payload);

      expect(res.status).toBe(422);
    });

    it("should not create if url is not provided", async () => {
      const payload = {
        title: "teste",
      };

      const res = await supertest(app).post("/articles").send(payload);

      expect(res.status).toBe(422);
    });

    it("Should return the id after success", async () => {
      const payload = {
        title: "Teste",
        url: "http://exemplo.com",
      };
      const res = await addArticle(payload);

      expect(res.body.id).toBe(1);
    });

    it("Should add article with favorite true", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        favorite: true,
      });
      const database = db.query(`SELECT * FROM articles WHERE id = 1`).get();
      // @ts-ignore
      expect(database.favorite).toBe(1);
    });

    it("Should create the article with the status unread as default", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        favorite: true,
      });
      const database = db.query(`SELECT * FROM articles WHERE id = 1`).get();
      // @ts-ignore
      expect(database.status).toBe("unread");
    });
  });

  describe("PATCH /articles/:id", () => {
    it("should update the article title only", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "foo",
      });

      const result = await supertest(app)
        .patch("/articles/1")
        .send({
          title: "Article 2",
        })
        .expect(200);

      expect(result.body.title).toBe("Article 2");
      expect(result.body.tags).toEqual(["foo"]);
    });

    it("Should update the article to favorite", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "foo",
      });
      const result = await supertest(app)
        .patch("/articles/1")
        .send({
          favorite: true,
        })
        .expect(200);
      expect(result.body.favorite).toBe(true);
    });

    it("Should update the status to read/achive", async () => {
      await addArticle({
        title: "Article 1",
        url: "/articles",
        tags: "foo",
      });

      const update = (status: string) =>
        supertest(app)
          .patch("/articles/1")
          .send({
            status,
          })
          .expect(200);

      expect((await update("read")).body.status).toBe("read");
      expect((await update("archive")).body.status).toBe("archive");
    });
  });

  describe("DELETE /articles/:id", () => {
    it("should delete the article id", async () => {
      await addArticle({
        title: "Article 1",
        url: "http://exemplo.com",
      });
      await supertest(app).delete("/articles/1").expect(200);
      const database = db.query(`SELECT * FROM articles WHERE id = 1`).all();
      expect(database.length).toBe(0);
    });
  });
});
