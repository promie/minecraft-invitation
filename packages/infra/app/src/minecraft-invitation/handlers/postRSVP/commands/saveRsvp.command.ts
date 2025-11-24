import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'
import type { BodySchema } from '../bodySchema'

export type SaveRsvpCommandInput = {
  rsvpData: BodySchema
  tableName: string
  docClient: DynamoDBDocumentClient
}

export type SaveRsvpCommandOutput = {
  name: string
  attending: 'yes' | 'no'
  guests: number
  createdAt: string
  updatedAt: string
}

export const saveRsvp = async (
  input: SaveRsvpCommandInput,
): Promise<SaveRsvpCommandOutput> => {
  const { rsvpData, tableName, docClient } = input

  // Query to find existing RSVP by name
  const queryResult = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: 'name-index',
      KeyConditionExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': rsvpData.name,
      },
      Limit: 1,
    }),
  )

  const existingItem = queryResult.Items?.[0]
  const now = new Date().toISOString()

  // Generate ID - use existing ID if found, otherwise generate new one
  const id = existingItem?.id || `${rsvpData.name}-${Date.now()}`

  // Prepare item for DynamoDB
  // If attending is "no", set guests to 0, otherwise use provided guests
  const item = {
    id,
    name: rsvpData.name,
    attending: rsvpData.attending,
    guests: rsvpData.attending === 'no' ? 0 : rsvpData.guests,
    createdAt: existingItem?.createdAt || now,
    updatedAt: now,
  }

  // Save to DynamoDB (PutCommand will overwrite if exists)
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    }),
  )

  // Return RSVP data (excluding id)
  const { id: _id, ...rsvpResponse } = item
  return rsvpResponse
}
