# Contributing to alfa-leetcode-api

I'm excited you're interested in contributing to **alfa-leetcode-api**, a custom solution born out of the need for a well-documented and detailed LeetCode API. This project is designed to provide developers with endpoints that offer insights into a user's profile, badges, solved questions, contest details, contest history, submissions, and also daily questions, selected problem, list of problems.

## Reporting Bugs

If you find a bug, please check the Issues to see if it has already been reported. If not, open a new issue with a clear `title` and `description`. Include as much detail as possible to help us reproduce the issue:

- A clear and concise description of the bug.
- Steps to reproduce the behavior.
- Expected behavior.
- Screenshots or a video if applicable.

## Suggesting Enhancements

All ideas for new features or improvements are welcome. If you have a suggestion, please create a new topic on the [discussions page](https://github.com/alfaarghya/alfa-leetcode-api/discussions). Describe your idea and why you think it would be a good addition to the project.

### Working on Issues

First requirement: use the program. I've seen people wanting to contribute without using it.

Issues will only be assigned to users when enough discussion about their implementation has taken place. It's important that nobody keeps an issue assigned without making progress, as this prevents others from contributing. So, if you want to write code for an existing issue, start by discussing the issue and your proposed solution first.

I do think it's fine if you submit a PR for a bugfix you made without prior discussion, as long as you take the time to explain the **why** and the **how**. In that case, the issue won't be assigned to you until the merge is complete.

### Generative AI use

I don't want to go as far as prohibiting anyone from using AI. After all, at this point, _some AI use_ is inevitable. However, **purely vibe-coded PRs are not going to be approved**.

If you're using AI to generate code, you must make it very clear. And you'll have to own it and maintain it. I will review and ask as many questions as necessary about the code, and I reserve the right to judge whether I think the contribution is worth it or not.

Also, not properly communicating that you're using generated code in your PR is considered dishonest. If I find out, I'll have to close the PR.

## Submitting a Pull Request

1. Fork the repository and create your branch from `main`. Call it `feature/xyz-feature` or `bug/xyz-bug`.
2. Clone your forked repository to your local machine.
3. Implement your changes. Please ensure your code is:
   - well-written
   - well formatted (see [Code Quality and Formatting](#code-quality-and-formatting) section below)
4. Write clear, concise commit messages.
5. run tests with `npm run test` before pushing
6. Push your changes to your fork.

Open a new pull request from your branch to the `main` branch of **alfa-leetcode-api**.

Provide a clear description of the changes in your pull request. If your PR addresses an existing issue, please reference it. Images and videos are always appreciated, for a quicker understanding of what has been implemented.

## Code Quality and Formatting

This project uses [BiomeJS](https://biomejs.dev/) for code linting and formatting. All contributions must pass linting and formatting checks before being merged.

### Before Submitting Your PR

Run the following command to check and fix any linting or formatting issues:

```bash
npm run check:fix
```

This will:

- Auto-fix linting issues where possible
- Apply consistent code formatting across your changes

### Available Scripts

- `npm run lint` - Check for linting issues without fixing
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Check code formatting without fixing
- `npm run format:fix` - Apply code formatting
- `npm run check` - Run both lint and format checks
- `npm run check:fix` - Fix all issues (recommended before commits)

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically format your code when you commit. Staged files will be automatically linted and formatted before each commit, ensuring consistent code style throughout the project.

## Setting up Your Development Environment

To start contributing, you'll need to set up your local environment.

Clone the repository:

```bash
git clone https://github.com/<username>/alfa-leetcode-api.git
cd alfa-leetcode-api # go to the project
npm install # install required modules
npm run dev # run the project
```

Thank you for helping us to improve **alfa-leetcode-api**!
