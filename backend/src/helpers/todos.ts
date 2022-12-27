import { PageableTodoList } from './../models/PageableTodoList';
import { TodoItem } from './../models/TodoItem';
import { APIGatewayProxyEvent } from 'aws-lambda'
import { TodoAccess } from './todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../lambda/utils';
import * as uuid from 'uuid'
import { deleteAttachment, getUploadUrl } from './attachmentUtils';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { Key } from 'aws-sdk/clients/dynamodb'

const s3BucketName = process.env.ATTACHMENT_S3_BUCKET

const todoAccess = new TodoAccess()
const logger = createLogger('Todos Business Logic')

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    let todoId = uuid.v4()
    let currentTime = new Date().toISOString()

    let todo = {
        todoId: todoId,
        createdAt: currentTime,
        userId: userId,
        done: false,
        attachmentUrl: " ",
        ...createTodoRequest
    }

    return await todoAccess.createTodoItem(todo)
}

export async function updateTodo(event: APIGatewayProxyEvent): Promise<void> {
    const todoData: UpdateTodoRequest = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    await todoAccess.updateTodo(userId, todoId, todoData)
}


export async function getTodosForUser(event: APIGatewayProxyEvent, limit: number, nextKey: Key): Promise<PageableTodoList> {
    let userId = getUserId(event)
    let todoItems = await todoAccess.getTodoItemsByUserId(userId, limit, nextKey)

    return todoItems;
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    // Delete attachment object from S3
    logger.info('delete S3 object', todoId)
    await deleteAttachment(todoId)

    // TODO: Remove a TODO item by id
    logger.info('delete TODO item', userId, todoId)
    await todoAccess.deleteTodo(userId, todoId)
}

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {
    let todoItem = await todoAccess.getTodoItemById(userId, todoId)
    todoItem.attachmentUrl = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    await todoAccess.updateTodoAttachmentUrl(todoItem)
    let uploadUrl = getUploadUrl(todoId)

    return uploadUrl;
}

export async function getTodoById(userId: string, todoId: string): Promise<TodoItem> {
    logger.info('delete TODO item', userId, todoId)
    let todo = await todoAccess.getTodoItemById(userId, todoId)
    return todo as TodoItem
}