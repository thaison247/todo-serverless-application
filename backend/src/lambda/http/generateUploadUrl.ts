import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { generateUploadUrl } from '../../helpers/todos'
import { getUserId } from '../utils'
// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    try {
      let uploadUrl = await generateUploadUrl(userId, todoId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: uploadUrl
        })
      }
    } catch (error) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error
        })
      }
    }
  
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
