import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'

export function parseNextKeyParameter(event: APIGatewayProxyEvent) {
    const nextKeyStr = getQueryParameter(event, 'nextKey')
    if (!nextKeyStr) {
      return undefined
    }
  
    const uriDecoded = decodeURIComponent(nextKeyStr)
    return JSON.parse(uriDecoded)
}
  
export function getQueryParameter(event: APIGatewayProxyEvent, name: string) {
    const queryParams = event.queryStringParameters
    if (!queryParams) {
        return undefined
    }

    return queryParams[name]
}

export function parseLimitParameter(event: APIGatewayProxyEvent) {
    const limitStr = getQueryParameter(event, 'limit')
    if (!limitStr) {
        return undefined
    }

    const limit = parseInt(limitStr, 10)
    if (limit <= 0) {
        throw new Error('Limit should be positive')
    }

    return limit
}

export function encodeLastEvaluatedKey(lastEvaluatedKey: any) {
    if (!lastEvaluatedKey) {
        return null
    }

    return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}