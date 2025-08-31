import { z } from "zod";
import type { ArticleDto, EntityArticle } from "./articles.types.ts";

export const statusEnum = ["read", "unread", "archive"];

export function isArticleDtoCreateValid(article: Partial<ArticleDto>) {
  const schema = z.object({
    title: z.string(),
    url: z.string(),
    tags: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    publicationDate: z.string().optional(),
    readTime: z.number().optional(),
    description: z.string().optional(),
    status: z.enum(statusEnum).optional(),
  });
  return schema.parse(article);
}

export function isArticleDtoPatchValid(article: Partial<ArticleDto>) {
  const schema = z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    tags: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    publicationDate: z.string().optional(),
    readTime: z.number().optional(),
    description: z.string().optional(),
    status: z.enum(statusEnum).optional(),
  });
  return schema.parse(article);
}

export const tagsFromArticles = (
  databaseTags: { tags: string }[],
): string[] => {
  return [
    ...new Set(
      databaseTags
        .map((database) => database.tags)
        .filter((tags) => !!tags)
        .map((tags) => tags?.split("|"))
        .flatMap((tag) => tag)
        .map((tag) => tag?.toLowerCase()),
    ),
  ];
};

// @ts-ignore
export function toResponseDto(article: EntityArticle): ArticleDto {
  const readTime = article.read_time;
  // @ts-ignore
  delete article.read_time;
  const timeAdded = article.time_added;
  // @ts-ignore
  delete article.time_added;
  const publicationDate = article.publication_date;
  // @ts-ignore
  delete article.publication_date;

  const tags = article.tags !== "" ? article?.tags?.split("|") : [];
  // @ts-ignore
  delete article?.tags;

  return {
    ...article,
    favorite: !!article.favorite,
    readTime,
    timeAdded,
    publicationDate,
    tags,
  };
}
