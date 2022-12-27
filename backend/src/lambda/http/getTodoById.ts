import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodoById } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('Http handler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    try {
      let todoItem = await getTodoById(userId, todoId)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          ...todoItem
        })
      }
    } catch (error) {
      logger.error('Internal server error ' +  error.message)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)