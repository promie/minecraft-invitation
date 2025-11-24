import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

export type GetAllRsvpsCommandInput = {
  tableName: string
  docClient: DynamoDBDocumentClient
}

export type RsvpItem = {
  name: string
  attending: 'yes' | 'no'
  guests: number
  createdAt?: string
  updatedAt?: string
}

export type GetAllRsvpsCommandOutput = {
  rsvps: RsvpItem[]
}

export const getAllRsvps = async (
  input: GetAllRsvpsCommandInput,
): Promise<GetAllRsvpsCommandOutput> => {
  const { tableName, docClient } = input

  // Scan DynamoDB to get all RSVPs
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    }),
  )

  if (!result.Items || result.Items.length === 0) {
    return { rsvps: [] }
  }

  // Return all RSVPs (excluding internal id field)
  const rsvps = result.Items.map(
    ({ id: _id, ...rsvpData }) => rsvpData,
  ) as RsvpItem[]

  return { rsvps }
}
