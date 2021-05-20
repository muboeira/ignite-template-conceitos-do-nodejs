const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const userFound = users.find((user) => user.username === username);
  if (!userFound) {
    return response.status(404).json({ error: 'Username not found.' });
  }
  request.body.user = userFound
  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (users.find((user) => user.username === username)) {
    return response.status(400).json({ error: 'Username already exists.' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.body.user;
  return response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline, user } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  user.todos.push(newTodo);
  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline, user } = request.body;

  const todoFound = user.todos.find((todo) => todo.id === id)

  if (!todoFound) {
    return response.status(404).json({ error: 'Todo not found.' });
  }

  todoFound.title = title
  todoFound.deadline = deadline

  return response.status(200).json(todoFound);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request.body; 

  const todoFound = user.todos.find((todo) => todo.id === id)

  if (!todoFound) {
    return response.status(404).json({ error: 'Todo not found.' });
  }

  todoFound.done = true

  return response.status(200).json(todoFound);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request.body;

  const todoFound = user.todos.find((todo) => todo.id === id)

  if (!todoFound) {
    return response.status(404).json({ error: 'Todo not found.' });
  }

  user.todos = user.todos.filter((todo) => todo.id !== id)

  return response.status(204).json(users.todos);
});

module.exports = app;