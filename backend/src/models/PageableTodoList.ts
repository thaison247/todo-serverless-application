import { Key } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from './TodoItem';
export interface PageableTodoList {
    data: TodoItem[]
    limit: number
    lastEvaluatedKey: Key
  }
  