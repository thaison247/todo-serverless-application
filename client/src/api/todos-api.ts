import { GenerateUploadUrlResponse } from './../types/GenerateUploadUrlResponse';
import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

interface PageableTodos {
  todos: Todo[]
  limit: number
  nextKey: any
}

export async function getTodos(idToken: string, limit?: number, filter?: string): Promise<PageableTodos> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos?limit=${limit}&filter=${filter}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return { todos: response.data.data, limit: response.data.limit, nextKey: response.data.lastEvaluatedKey}
}

export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  const response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<GenerateUploadUrlResponse> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  console.log("getUploadUrl resp: ", response.data)

  return {uploadUrl: response.data.uploadUrl, attachmentUrl: response.data.attachmentUrl} 
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function getMoreTodoItems(idToken: string, nextKey?: string, limit = 2): Promise<PageableTodos> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos?limit=${limit}&nextKey=${nextKey}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('More Todos:', response.data)
  return { todos: response.data.data, limit: response.data.limit, nextKey: response.data.lastEvaluatedKey}
}

export async function getTodoItemById(idToken: string, todoId: string): Promise<Todo> {
  console.log('Fetching todo by id')

  const response = await Axios.get(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todo item:', response.data)
  return { ...response.data }
}