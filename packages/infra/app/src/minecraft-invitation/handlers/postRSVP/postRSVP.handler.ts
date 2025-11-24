import type {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../../common/logger'
import { createApiResponse } from '../../common/api/createApiResponse'
import { saveRsvp } from './commands/saveRsvp.command'
import { initConfig } from './config'
import { bodySchema } from './bodySchema'

const logger = createLogger('postRSVP')
const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const { TABLE_NAME } = initConfig()

export const handler: APIGatewayProxyHandler = async (
  event,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Post RSVP request received', {
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
    if (!event.body) {
      logger.warn('Missing request body')
      return createApiResponse(400, { error: 'Missing request body' })
    }

    const parsedBody = JSON.parse(event.body)
    const validationResult = bodySchema.safeParse(parsedBody)

    if (!validationResult.success) {
      logger.warn('Invalid request body', {
        errors: validationResult.error.issues,
      })
      return createApiResponse(400, {
        error: 'Invalid request body',
        details: validationResult.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }

    const rsvpData = validationResult.data

    const result = await saveRsvp({
      rsvpData,
      tableName: TABLE_NAME,
      docClient,
    })

    logger.info('RSVP saved', {
      name: rsvpData.name,
      attending: rsvpData.attending,
    })

    return createApiResponse(200, result)
  } catch (error) {
    logger.error('Error saving RSVP', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return createApiResponse(500, { error: 'Failed to save RSVP' })
  }
}
