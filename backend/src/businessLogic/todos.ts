import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../lambda/utils";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { TodosFunctions } from "../dataLayer/TodosFunctions";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

const todosFunctions = new TodosFunctions();

export async function getAllTodos(
  event: APIGatewayProxyEvent
): Promise<TodoItem[]> {
  const userId = getUserId(event);
  const allTodoList = todosFunctions. getAllTodoList(userId);
  return allTodoList
}

export async function createTodo(
  event: APIGatewayProxyEvent
): Promise<TodoItem> {
  const itemId = uuid.v4();
  const userId = getUserId(event);
  const newTodo: CreateTodoRequest =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const createdTodo = await todosFunctions.createTodoItem({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  });
  return createdTodo;
}
export async function generateUploadUrl(
  event: APIGatewayProxyEvent
): Promise<string> {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const generatedUrl = await todosFunctions.generateUploadUrl(todoId, userId);
  return generatedUrl
}
export async function updateTodo(event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const updatedItem: UpdateTodoRequest = JSON.parse(event.body);
  const newTodo = await todosFunctions.updateTodoItem(userId, todoId, updatedItem);
  return newTodo
}
export async function deleteTodo(event: APIGatewayProxyEvent) {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;
  const deletedItem = await todosFunctions.deleteTodoItem(todoId, userId);
  return deletedItem
}
