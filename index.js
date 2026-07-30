#!/usr/bin/env node
import * as fs from 'node:fs/promises';

const [, , command, ...args] = process.argv;
let tasks = await loadTasks();

async function loadTasks() {
  try {
    const data = await fs.readFile('tasks.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile('tasks.json', '[]');
      return [];
    } else {
      console.error('Error reading file', err);
    }
  }
}

const getNextId = (tasks) => {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((task) => task.id)) + 1;
};

const validateID = (id) => {
  const numId = Number(id);
  if (isNaN(numId)) {
    console.error('Error: id must be a number');
    process.exit(1);
  }
  return numId;
};

const taskToSave = async (dataSave) => {
  const jsonString = JSON.stringify(dataSave, null, 2);
  await fs.writeFile('tasks.json', jsonString, 'utf8');
};

const addTask = async (description) => {
  if (description === undefined || description.trim().length === 0) {
    console.error('Error: the description cannot be empty');
    return;
  }

  const new_task = {
    id: getNextId(tasks),
    description: description,
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(new_task);

  try {
    await taskToSave(tasks);
    console.log(`Task added successfully! (ID: ${new_task.id})`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
};

const deleteTask = async (id) => {
  const numId = validateID(id);

  const edit_tasks = tasks.filter((task) => task.id !== numId);

  if (edit_tasks.length === tasks.length) {
    console.error(`Error: task ${numId} not found`);
    return;
  }

  try {
    await taskToSave(edit_tasks);
    console.log('Task delete successfully!');
  } catch (err) {
    console.error('Error delete task:', err);
  }
};

const updateTask = async (id, description) => {
  const numId = validateID(id);

  if (description === undefined || description.trim().length === 0) {
    console.log('Error: the description cannot be empty');
    return;
  }

  const edit_tasks = tasks.map((task) => {
    if (task.id === numId) {
      return { ...task, description: description, updatedAt: new Date() };
    }
    return task;
  });

  try {
    await taskToSave(edit_tasks);
    console.log(`Task ${id} updated successfully!`);
  } catch (err) {
    console.error('Error update task:', err);
  }
};

const updateStatus = async (id, status) => {
  const numId = validateID(id);

  const edit_tasks = tasks.map((task) => {
    if (task.id === numId) {
      return { ...task, status: status, updatedAt: new Date() };
    }
    return task;
  });

  try {
    await taskToSave(edit_tasks);
    console.log(`Task ${id} marked as ${status}`);
  } catch (err) {
    console.error('Error update task:', err);
  }
};

switch (command) {
  case 'add': {
    const description = args.join(' ');
    await addTask(description);
    break;
  }
  case 'delete': {
    const [id] = args;
    await deleteTask(id);
    break;
  }
  case 'update': {
    const [id, ...other] = args;
    const description = other.join(' ');
    await updateTask(id, description);
    break;
  }
  case 'mark-in-progress': {
    const [id] = args;
    await updateStatus(id, 'in-progress');
    break;
  }
  case 'mark-done': {
    const [id] = args;
    await updateStatus(id, 'done');
    break;
  }
  case 'list': {
    const [filter] = args;
    if (filter === 'done' || filter === 'in-progress' || filter === 'todo') {
      console.log(tasks.filter((task) => task.status === filter));
    } else {
      console.log(tasks);
    }
    break;
  }
  default:
    console.log('This command was not found');
    break;
}
