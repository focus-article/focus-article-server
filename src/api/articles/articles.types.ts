export type ArticleDto = {
  title: string;
  url: string;
  description: string;
  favorite: boolean;
  author: string;
  image: string;
  tags: string[];
  timeAdded: number;
  publicationDate: string;
  readTime: number;
};

export type EntityArticle = {
  title: string;
  url: string;
  description: string;
  favorite: number;
  author: string;
  image: string;
  tags: string;
  time_added: number;
  publication_date: string;
  read_time: number;
};
