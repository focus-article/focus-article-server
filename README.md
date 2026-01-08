# Focus Article Server API

Back-end implementation of Focus Article: A minimal self-storage project to save your favorite articles without any distraction.

## Prerequisites

- [Focus Article UI](https://github.com/mathiasgheno/focus-article)
- [(optional) Focus Article Chrome Extension](https://github.com/mathiasgheno/focus-article-chrome-extension)

## How to Run

1. First, install all dependencies

```bash
bun install
```

2. Run the server

```bash
bun run watch
```

## Startup with your O.S

1. Install pm2 globally

```bash
npm i pm2 -g
```

2. Run pm2 script

```
bun run pm2
```

This is going to run focus-article-server on port 3001. You need to do the same with focus-article-ui.

> Attention: If you already run this command before, you should run `pm2 kill` before.
