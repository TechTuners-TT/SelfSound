# Contribution Guidelines

Thank you for your interest in contributing to the project! To keep our development process efficient and maintainable, please follow these guidelines.

---

## 📑 Table of Contents

1. [🌱 Branching Strategy](#branching-strategy)
2. [📌 Workflow for Contributions](#workflow-for-contributions)
3. [🔹 How to Name Branches?](#how-to-name-branches)
4. [✏️ Commit Messages & Commit Frequency](#commit-messages--commit-frequency)
   1. [🔹 How to Write a Good Commit Message?](#how-to-write-a-good-commit-message)
5. [🔎 How to Make a Pull Request (PR)](#how-to-make-a-pull-request-pr)
6. [🚀 Releasing a Stable Version](#releasing-a-stable-version)
7. [🛠 Code Style & Best Practices](#code-style--best-practices)
8. [🤝 Need Help?](#need-help)

---

## 🌱 Branching Strategy

We use a **feature branch workflow** with two main branches:

- **`main`** – Contains only stable, production-ready code.
- **`develop`** – Active development happens here.

All feature development and bug fixes should be done in separate branches and merged into `develop`. Only tested, stable versions are merged into `main`.

---

## 📌 Workflow for Contributions

1. **Create a feature branch**

   - Branch off from `develop`
   - Name it clearly, e.g., `feature/login-ui` or `fix/api-timeout`

2. **Commit regularly & write clear messages**

   - Follow commit message conventions (e.g., `feat: add user login form` or `fix: resolve API timeout issue`).

3. **Push and create a pull request (PR)**

   - Always create PRs into `develop`, never directly into `main`.

4. **Testing and review**

   - Ensure your code is tested before merging.
   - CI/CD will run automated tests.
   - Another team member should review your PR.

5. **Merging strategy**
   - Once approved and tested, your PR is merged into `develop`.
   - After a sprint, the stable `develop` version is tested again.
   - A final PR merges the sprint-tested version into `main`.

---

## 🔹 How to Name Branches?

To keep our repository structured and easy to navigate, follow this naming convention for branches:

```bash
git checkout -b "develop-<Jira-task-code>/<short-description>"
```

**Example:**
develop/SFS-73/fix-login-page

- Always start with `develop/` to indicate that the branch is for active development.
- Use the **Jira task code** to link it directly to the task being worked on.
- Optionally, add a short, clear description if needed.

This helps track work efficiently and keeps branches organized. 🚀

---

## ✏️ Commit Messages & Commit Frequency

Writing clear, structured commit messages is essential for maintaining a readable and organized project history. Follow these guidelines to ensure consistency:

---

### 🔹 How to Write a Good Commit Message?

Each commit message should follow this format:

```bash
git commit -m "<type>(Jira task code): <short description>"
```

---

**Keywords:**

- `feat:` – Adding a new feature
- `fix:` – Fixing a bug
- `chore:` – Maintenance tasks (e.g., updating dependencies)
- `docs:` – Changes to documentation
- `style:` – Code style improvements (e.g., formatting, linting)
- `refactor:` – Code restructuring without changing functionality
- `test:` – Adding or updating tests
- `ci:` – Continuous Integration & Deployment updates

**Example:**

```bash
git commit -m "feat(SFS-55): implement user authentication"
git commit -m "fix(SFS-89): resolve logout button issue"
git commit -m "docs(SFS-102): update README with setup instructions"
```

---

## 🔹 How to Make a Pull Request (PR)

Once you've completed your work on a feature or bug fix, follow these steps to create a proper Pull Request:

#### 1️⃣ Ensure Your Work is Up to Date

Before creating a PR, make sure your local branch is updated with the latest changes:

```bash
git checkout develop
git pull origin develop
```

#### 2️⃣ Push Your Changes

After pull all latest changes:

```bash
git checkout develop-<Jira-task-code>/<short-description>

!!! Make sure git does not see any sensitive data !!!
git status

git add <nessesary-files>
git commit -m "<type>(Jira task code): <short description>"
git ush origin develop-<Jira-task-code>/<short-description>
```

#### 3️⃣ Create a Pull Request

1. Go to the GitHub repository page.

2. Navigate to the Pull Requests section.

3. Click on New Pull Request.

4. Select your feature branch (develop/<Jira-task-code>/<short-description>) as the source and `develop` branch as the target.

5. Add a clear title and description that explains the changes you made, referencing the Jira task.

6. Submit the Pull Request.

#### 4️⃣ Code Review and Merging

Your PR will be reviewed by other team members.

Once approved, the PR will be merged into the develop branch directly on GitHub.

---

## 🚀 Releasing a Stable Version

- Only well-tested, fully functional code is merged from `develop` into `main`.
- Before merging into `main`, final checks ensure no critical bugs.
- Deployment happens after Pull Request into `main`.

---

## 🛠 Code Style & Best Practices

- Follow project-specific coding conventions.
- Use clear variable and function names.
- Keep your code modular and well-documented.
- If in doubt, check the existing code for reference.

---

## 🔍 Need Help?

If you're unsure about anything, ask in the team chat before making big changes. Happy coding! 🚀
