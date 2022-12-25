import { APIGatewayProxyEvent } from 'aws-lambda'
import { TodoAccess } from './todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../lambda/utils';
import * as uuid from 'uuid'
// import { AttachmentUtils } from './attachmentUtils';
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
const todoAccess = new TodoAccess()

export async function createTodo(event: APIGatewayProxyEvent): Promise<TodoItem> {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    let todoId = uuid.v4()
    let currentTime = new Date().toISOString()

    let todo = {
        todoId: todoId,
        createdAt: currentTime,
        userId: getUserId(event),
        done: false,
        attachmentUrl: " ",
        ...newTodo
    }

    return await todoAccess.createTodoItem(todo)
}


export async function getTodosForUser(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
    let userId = getUserId(event)
    let todoItems = await todoAccess.getTodoItemsByUserId(userId)

    return todoItems;
}