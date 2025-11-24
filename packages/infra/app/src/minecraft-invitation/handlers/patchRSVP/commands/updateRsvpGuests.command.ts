import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'

export type UpdateRsvpGuestsCommandInput = {
  name: string
  guests: number
  tableName: string
  docClient: DynamoDBDocumentClient
}

export type UpdateRsvpGuestsCommandOutput = {
  name: string
  attending: 'yes' | 'no'
  guests: number
  createdAt: string
  updatedAt: string
}

export const updateRsvpGuests = async (
  input: UpdateRsvpGuestsCommandInput,
): Promise<UpdateRsvpGuestsCommandOutput> => {
  const { name, guests, tableName, docClient } = input

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
        ':name': name,
      },
      Limit: 1,
    }),
  )

  if (!queryResult.Items || queryResult.Items.length === 0) {
    throw new Error('RSVP not found')
  }

  const existingItem = queryResult.Items[0]
  const now = new Date().toISOString()

  // Update the item with new guests count
  const updatedItem = {
    ...existingItem,
    guests,
    updatedAt: now,
  } as Record<string, unknown>

  // Save updated item
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: updatedItem,
    }),
  )

  // Return updated RSVP data (excluding id)
  const { id: _id, ...rsvpResponse } = updatedItem
  return rsvpResponse as UpdateRsvpGuestsCommandOutput
}
