# Transit Mapper

Minimal, production-ready Tokyo transit map app built with **React + Vite**, **Mapbox GL JS**, and **Material UI**.

## Stack

- React (Vite)
- Mapbox GL JS
- MUI (`@mui/material`)
- MUI Icons (`@mui/icons-material`)
- Static hosting via GitHub Pages (no backend)

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Set your Mapbox token locally

Create a `.env` file in the project root:

```env
VITE_MAPBOX_TOKEN=your_mapbox_public_access_token_here
```

You can copy from the provided template:

```bash
cp .env.example .env
```

### 3) Run dev server

```bash
npm run dev
```

### 4) Build production bundle

```bash
npm run build
```

## Map defaults

- Center: **Tokyo, Japan**
  - Latitude: `35.6762`
  - Longitude: `139.6503`
- Zoom: `11`

## GitHub Pages deployment

### Workflow

Deployment workflow file: `.github/workflows/deploy.yml`

- Uses Node 20
- Installs dependencies
- Runs `npm run build`
- Uploads `dist` artifact
- Deploys with official GitHub Pages actions
- Triggers on pushes to `main`

### Add repository secret

1. Go to your repository on GitHub.
2. Open **Settings** -> **Secrets and variables** -> **Actions**.
3. Click **New repository secret**.
4. Name: `VITE_MAPBOX_TOKEN`
5. Value: your Mapbox public access token.

> The value is injected at build time. Since Vite embeds environment variables into frontend code, treat this token as public.

### Enable GitHub Pages for GitHub Actions

1. Go to **Settings** -> **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

### Expected site URL format

This app is configured with:

```js
base: "/transit-mapper/";
```

So the final URL format is:

`https://<github-username>.github.io/transit-mapper/`

## Install command list (used in this project)

```bash
npm install react react-dom mapbox-gl @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D vite @vitejs/plugin-react
```