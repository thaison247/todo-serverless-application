// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoItem } from '../models/TodoItem'

// const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')



export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }
  

  async getTodoItemById(userId: string, todoId: string): Promise<TodoItem> {
    logger.info('Getting todo items by totoId')
    logger.info('userId: ', userId)
    logger.info('todoId: ', todoId)

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
      .promise()

    logger.info('result: ', result)

    return result.Item as TodoItem
  }
  

  async getTodoItemsByUserId(userId: string): Promise<TodoItem[]> {
    logger.info('Getting todo items by userId')

    const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()
    
      return result.Items as TodoItem[]
  }

  
  async createTodoItem(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }


  async updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues: {
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done
      },
      ExpressionAttributeNames: { '#name': 'name' },
      ReturnValues: "NONE"
    }).promise()
  }

  
  async updateTodoAttachmentUrl(todo: TodoItem): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId: todo.userId,
        todoId: todo.todoId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": todo.attachmentUrl
      },
      ReturnValues: "NONE"
    }).promise()
  }


  async deleteTodo(userId: string, todoId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: { userId, todoId }
    }).promise()
  }
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
