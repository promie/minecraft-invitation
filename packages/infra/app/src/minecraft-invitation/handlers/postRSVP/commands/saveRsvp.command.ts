import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb'
import type { BodySchema } from '../bodySchema'

export type SaveRsvpCommandInput = {
  rsvpData: BodySchema
  tableName: string
  docClient: DynamoDBDocumentClient
}

export type SaveRsvpCommandOutput =
  | {
      name: string
      attending: 'yes' | 'no'
      guests: number
      createdAt: string
      updatedAt: string
    }
  | { message: string }

export const saveRsvp = async (
  input: SaveRsvpCommandInput,
): Promise<SaveRsvpCommandOutput> => {
  const { rsvpData, tableName, docClient } = input

  // Get existing item to check if it's an update
  const existingResult = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id: rsvpData.deviceId },
    }),
  )

  const now = new Date().toISOString()

  // Prepare item for DynamoDB
  const item = {
    id: rsvpData.deviceId,
    name: rsvpData.name,
    attending: rsvpData.attending,
    guests: rsvpData.guests,
    createdAt: existingResult.Item?.createdAt || now,
    updatedAt: now,
  }

  // If attending is "no", delete the item from DynamoDB
  if (rsvpData.attending === 'no') {
    await docClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id: rsvpData.deviceId },
      }),
    )
    return { message: 'RSVP removed' }
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
