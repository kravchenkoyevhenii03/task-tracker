# Task Tracker CLI

A simple command-line application for managing tasks (CRUD) — built with Node.js, no external dependencies. Data is stored locally in a `tasks.json` file.

### About

This project is an implementation of the [Task Tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh).

## Requirements

- Node.js 18+ (uses `node:fs/promises`)

## Installation

```bash
git clone <repo-url>
cd task-tracker-cli
```

The `tasks.json` file is created automatically on first run if it doesn't already exist.

### Global install (optional)

To run the app as `task-cli` from any directory:

```bash
npm link
```

After that, the commands below can be run via `task-cli` instead of `node index.js`.

## Usage

```bash
node index.js <command> [arguments]
```

### Add a task

```bash
node index.js add Buy milk
```

### Delete a task

```bash
node index.js delete <id>
```

### Update a task's description

```bash
node index.js update <id> New task description
```

### Mark status

```bash
node index.js mark-in-progress <id>
node index.js mark-done <id>
```

### List tasks

```bash
node index.js list
node index.js list todo
node index.js list in-progress
node index.js list done
```

## Task structure

Each task is stored in `tasks.json` in the following format:

```json
{
  "id": 1,
  "description": "Buy milk",
  "status": "todo",
  "createdAt": "2026-07-30T10:00:00.000Z",
  "updatedAt": "2026-07-30T10:00:00.000Z"
}
```

Status accepts one of the following values: `todo`, `in-progress`, `done`.

## Possible errors

- **`id must be a number`** — the provided id is not a number.
- **`task <id> not found`** — no task exists with that id.
- **`the description cannot be empty`** — task description cannot be empty.

## License

MIT
