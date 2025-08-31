import { tagsFromArticles } from "./articles.utils.ts";

describe("tagsFromArticles", () => {
  it("Should return not duplicated tags", () => {
    expect(
      tagsFromArticles([
        { tags: "node" },
        { tags: "typescript|Node" },
        { tags: "ai|Typescript" },
      ]),
    ).toEqual(["node", "typescript", "ai"]);
  });
});
