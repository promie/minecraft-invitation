import type {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../../common/logger'
import { createApiResponse } from '../../common/api/createApiResponse'
import { getAllRsvps } from './commands/getAllRsvps.command'
import { initConfig } from './config'

const logger = createLogger('getAllRSVPs')
const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const { TABLE_NAME } = initConfig()

export const handler: APIGatewayProxyHandler = async (
  event,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Get all RSVPs request received', {
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
    const result = await getAllRsvps({
      tableName: TABLE_NAME,
      docClient,
    })

    return createApiResponse(200, result)
  } catch (error) {
    logger.error('Error getting all RSVPs', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return createApiResponse(500, { error: 'Failed to get all RSVPs' })
  }
}
