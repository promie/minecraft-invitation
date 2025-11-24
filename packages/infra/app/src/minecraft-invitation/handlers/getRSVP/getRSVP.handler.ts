import type {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../../common/logger'
import { createApiResponse } from '../../common/api/createApiResponse'
import { getRsvpByName } from './commands/getRsvpByName.command'
import { initConfig } from './config'

const logger = createLogger('getRSVP')
const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const { TABLE_NAME } = initConfig()

export const handler: APIGatewayProxyHandler = async (
  event,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Get RSVP request received', {
    requestId: context.awsRequestId,
    httpMethod: event.httpMethod,
    path: event.path,
  })

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    logger.info('CORS preflight request')
    return createApiResponse(200, { message: 'OK' })
  }

  try {
    const name =
      event.queryStringParameters?.name ||
      (typeof event.headers === 'object' &&
      event.headers !== null &&
      'x-name' in event.headers
        ? String(event.headers['x-name'])
        : undefined) ||
      event.pathParameters?.name

    if (!name) {
      logger.warn('Name is required')
      return createApiResponse(400, { error: 'Name is required' })
    }

    const result = await getRsvpByName({
      name,
      tableName: TABLE_NAME,
      docClient,
    })

    if (!result) {
      return createApiResponse(404, { message: 'No RSVP found' })
    }

    return createApiResponse(200, result)
  } catch (error) {
    logger.error('Error getting RSVP', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return createApiResponse(500, { error: 'Failed to get RSVP' })
  }
}
