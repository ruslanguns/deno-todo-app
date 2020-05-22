import { Router } from "https://deno.land/x/oak/mod.ts";

interface Todo {
  description: string;
  id: number;
}

let todos: Todo[] = [
  {
    description: "Todo 1",
    id: 1,
  },
  {
    description: "Todo 2",
    id: 2,
  },
];

export const getTodos = ({ response }: { response: any }) => {
  response.body = todos;
};

export const getTodo = ({
  params,
  response,
}: {
  params: {
    id: string;
  };
  response: any;
}) => {
  const todo = todos.filter((todo) => todo.id === parseInt(params.id));
  if (todo.length) {
    response.status = 200;
    response.body = todo[0];
    return;
  }

  response.status = 400;
  response.body = { message: `Cannot find todo ${params.id}` };
};

export const addTodo = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const { description, id }: { description: string; id: number } = body.value;
  todos.push({
    description,
    id,
  });

  response.status = 200;
  response.body = { message: "OK" };
};

export const updateTodo = async ({
  params,
  request,
  response,
}: {
  params: {
    id: string;
  };
  request: any;
  response: any;
}) => {
  const temp = todos.filter(
    (existingTodo) => existingTodo.id === parseInt(params.id)
  );
  const body = await request.body();
  const description: string = body.value.description;

  if (temp.length) {
    temp[0].description = description;
    response.status = 200;
    response.body = { message: "OK" };
    return;
  }

  response.status = 400;
  response.body = { message: `Cannot find todo ${params.id}` };
};

export const removeTodo = ({
  params,
  response,
}: {
  params: {
    id: string;
  };
  response: any;
}) => {
  const lengthBefore = todos.length;
  todos = todos.filter((todo) => todo.id !== parseInt(params.id));

  if (todos.length === lengthBefore) {
    response.status = 400;
    response.body = { message: `Cannot find todo ${params.id}` };
    return;
  }

  response.status = 200;
  response.body = { message: "OK" };
};

export const getHome = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = { message: 'Deno API server is running.' };
};

export const router = new Router();
router
  .get("/", getHome)
  .get("/todos", getTodos)
  .get("/todos/:id", getTodo)
  .post("/todos", addTodo)
  .put("/todos/:id", updateTodo)
  .delete("/todos/:id", removeTodo);
