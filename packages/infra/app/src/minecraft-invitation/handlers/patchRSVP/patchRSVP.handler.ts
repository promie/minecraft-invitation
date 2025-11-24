import type {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../../common/logger'
import { createApiResponse } from '../../common/api/createApiResponse'
import { updateRsvpGuests } from './commands/updateRsvpGuests.command'
import { initConfig } from './config'
import { bodySchema } from './bodySchema'

const logger = createLogger('patchRSVP')
const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const { TABLE_NAME } = initConfig()

export const handler: APIGatewayProxyHandler = async (
  event,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Patch RSVP request received', {
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
    // Get name from path parameters
    const name = event.pathParameters?.name

    if (!name) {
      logger.warn('Name is required in path')
      return createApiResponse(400, { error: 'Name is required in path' })
    }

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

    const { guests } = validationResult.data

    const result = await updateRsvpGuests({
      name,
      guests,
      tableName: TABLE_NAME,
      docClient,
    })

    logger.info('RSVP guests updated', {
      name,
      guests,
    })

    return createApiResponse(200, result)
  } catch (error) {
    logger.error('Error updating RSVP guests', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    if (error instanceof Error && error.message === 'RSVP not found') {
      return createApiResponse(404, { error: 'RSVP not found' })
    }

    return createApiResponse(500, { error: 'Failed to update RSVP guests' })
  }
}

