const express = require('express');
const cors = require('cors');

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userExists = users.find((user) => user.username === username);

  if (!userExists) {
    return response.status(404).send({
      error: "Username not found",
    });
  }

  request.user = userExists;

  next();
}

function checkExistsTodo(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todoExists = user.todos.find((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).send({
      error: "Todo not found",
    });
  }

  request.selectedTodo = todoExists;

  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return response.status(400).send({
      error: "Username already exists",
    });
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  };

  users.push(user);

  response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).send(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).send(newTodo);
});

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    const { user, selectedTodo } = request;

    user.todos = user.todos.filter((todo) => todo.id !== selectedTodo.id);

    return response.status(204).send();
  }
);

module.exports = app;