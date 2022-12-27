import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import {parseLimitParameter, parseNextKeyParameter, encodeLastEvaluatedKey} from '../../helpers/paginationUtils'

const logger = createLogger('Http handler')

// Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let nextKey 
    let limit 

    try {
      nextKey = parseNextKeyParameter(event)
      limit = parseLimitParameter(event) || 5
    } catch (error) {
      logger.error('Failed to parse query parameters: ' +  error.message)
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error
        })
      }
    }

    // get data
    const pageableTodoList = await getTodosForUser(event, limit, nextKey)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        ...pageableTodoList,
        lastEvaluatedKey: encodeLastEvaluatedKey(pageableTodoList.lastEvaluatedKey)
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)