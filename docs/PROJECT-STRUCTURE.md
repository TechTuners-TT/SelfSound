# Project Structure & Tech Stack

Welcome to the project! Below is an overview of the project structure and technologies used in this project.

---

## 🔍 Project Structure

```bash
src/
├── api
│   └── auth.js
├── App.vue
├── assets
│   └── logo.png
├── clients
│   └── supabase.js
├── components
│   └── HelloWorld.vue
├── main.js
├── router
│   └── index.js
├── store
│   └── index.js
└── views
    ├── AboutView.vue
    ├── HomeView.vue
    ├── LoginView.vue
    ├── SecretView.vue
    ├── SignIn.vue
    ├── SignUp.vue
    └── UnauthorizedView.vue
```

# Project Directory Structure (src/)

The `src/` directory contains all the source code and assets for this project. Below is a breakdown of each directory and its purpose:

---

## `src/`

### `api/`

Contains files that define the API interactions for the project. It is used to manage communication between the frontend and backend, including authentication and other API calls.

- **Example**: `auth.js` handles authentication-related API calls (e.g., login, sign-up, token refresh).

---

### `assets/`

Holds static assets for the project, such as images, fonts, and icons. These are resources that are not dynamically generated but are used throughout the application.

- **Example**: `logo.png` is the project's logo, which can be displayed in the UI.

---

### `clients/`

Contains files related to connecting and interacting with external services or databases. For this project, it includes the Supabase client setup to handle backend tasks like user authentication and data storage.

- **Example**: `supabase.js` configures and exports the Supabase client for API interactions with the Supabase backend.

---

### `components/`

This directory contains reusable Vue components that can be used across multiple views in the application. These components are typically smaller, self-contained UI elements that represent parts of a page (like buttons, forms, etc.).

- **Example**: `HelloWorld.vue` is a basic example of a reusable component.

---

### `main.js`

The entry point of the application. This file is responsible for initializing the Vue app, registering components, and mounting the app to the DOM. It also configures Vue Router and Vuex if used.

---

### `router/`

Contains the Vue Router configuration, which defines the routes for different views in the application. It handles the logic for navigating between pages or views (e.g., Home, Login, About).

- **Example**: `index.js` defines the route paths and which components to load for each route.

---

### `store/`

This directory holds the Vuex store for state management. Vuex is used to store shared data and state that needs to be accessible across multiple components. It helps centralize state management for predictable behavior in the app.

- **Example**: `index.js` contains the Vuex store setup, including state, mutations, actions, and getters.

---

### `views/`

This directory contains the Vue components that represent the views or pages of the application. Views are typically larger components that combine smaller components and contain the page-specific logic.

- **Example**:
  - `HomeView.vue` is the main page of the app.
  - `LoginView.vue` is the login page.
  - `AboutView.vue` provides an about page for the app.
  - `UnauthorizedView.vue` is a fallback page for unauthorized users.

---

### `App.vue`

The root component of the Vue app. It serves as the container for all other components and is the starting point for rendering the application.

---

By organizing the project this way, we separate concerns logically, making the codebase easier to navigate and maintain. Each directory has a specific role in managing different aspects of the application.

---

## Root Files

- **README.md**: Project documentation file.
- **dist/**: Compiled production build.
- **jsconfig.json**: Configuration for JavaScript and IDE support.
- **package-lock.json**: Automatically generated file that locks dependencies.
- **postcss.config.js**: Configuration for PostCSS (used with Tailwind CSS).
- **vue.config.js**: Vue CLI configuration file.
- **babel.config.js**: Babel configuration for JS transpiling.
- **docs/**: Documentation files for the project.
- **node_modules/**: Directory containing the installed dependencies.
- **package.json**: Project metadata and dependencies.
- **public/**: Public directory for static assets like index.html.
- **tailwind.config.js**: Tailwind CSS configuration file for custom styling.

---

## 🔧 Tech Stack

The project is built with the following technologies:

- **Frontend Framework**:

  - **Vue.js** - A progressive JavaScript framework for building user interfaces.
  - **Vue Router** - The official router for Vue.js, handling page navigation.
  - **Vuex** - A state management library for Vue.js to manage app state.

- **Styling**:

  - **Tailwind CSS** - A utility-first CSS framework for rapid UI development.

- **Authentication & Backend**:

  - **Supabase** - An open-source Firebase alternative that provides backend-as-a-service, including authentication, database, and storage. We use the Supabase client for interacting with the backend API.

- **Build & Development Tools**:
  - **Vite** - A modern, fast build tool that optimizes the development workflow.
  - **PostCSS** - A tool for transforming CSS with JavaScript plugins (used for Tailwind CSS processing).
  - **Babel** - A JavaScript compiler for supporting newer JavaScript features across browsers.

---

## ⚙️ How the Project Works

1. **API Integration**:  
   The `src/api/auth.js` file handles authentication tasks (sign up, login, etc.) using the Supabase API.
2. **Routing**:  
   The `src/router/index.js` file contains all the routes for different views, such as `Home`, `Login`, `About`, and `Secret` views. The routing logic ensures the user is redirected to the appropriate page based on authentication status.

3. **State Management**:  
   The `src/store/index.js` file uses Vuex to manage the application state, such as user authentication status and other shared data between components.

4. **UI Components**:  
   Components like `HelloWorld.vue` are reusable UI elements that can be imported into other views or components.

5. **Views**:  
   The `views` folder contains various view components for different pages of the application (e.g., `HomeView.vue`, `LoginView.vue`, etc.).

---
