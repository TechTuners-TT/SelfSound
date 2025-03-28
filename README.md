# selfsound-frontend

## Features

- ...

## Prerequisites

Before you can run this project locally or deploy it, ensure you have the following installed:

- Node.js (version 14 or later)
- Vue CLI (for building and running the project)
- Supabase account and API keys

### Setup Supabase

1. Ask DevOps enineer to get access to the project [Supabase](https://supabase.io/).
2. Get your **Supabase URL** and **API Key** from the Supabase dashboard.

### Setup Environment Variables

Create a `.env` file in the root of your project to store your Supabase credentials securely:
```
VUE_APP_SUPABASE_URL=<your-supabase-url> 
VUE_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Frontend Setup

### Project setup
To install the project dependencies, run:

```bash
npm install
```

### Compiles and Hot-Reloads for Development

To start the development server, run:

```bash
npm run serve
```

Visit http://localhost:8080 to see the application in action.

### Compiles and Minifies for Production

To build the project for production, run:

```bash
npm run build
```

This will create an optimized version of your application for deployment.


### Lints and Fixes Files

To lint and fix your files, run:

```bash
npm run lint
```

## Deploying to GitHub Pages

From `main` branch where your stable version of code, run:

```bash
npm run deploy
```


### Enable GitHub Pages

To enable GitHub Pages for your repository, follow these steps:

1. Go to your GitHub repository.

2. Navigate to the Settings tab.

3. Scroll down to the GitHub Pages section.

4. In the Source dropdown, select the gh-pages branch.


After a few moments, your app should be live at:

`
https://techtuners-tt.github.io/frontend/
`
