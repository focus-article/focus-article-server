/// <reference types="bun-types" />

declare global {
  const describe: typeof import("bun:test").describe;
  const it: typeof import("bun:test").it;
  const test: typeof import("bun:test").test;
  const expect: typeof import("bun:test").expect;
  const beforeAll: typeof import("bun:test").beforeAll;
  const beforeEach: typeof import("bun:test").beforeEach;
  const afterAll: typeof import("bun:test").afterAll;
  const afterEach: typeof import("bun:test").afterEach;
}

export {};
