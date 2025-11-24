import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

export type GetRsvpByNameCommandInput = {
  name: string
  tableName: string
  docClient: DynamoDBDocumentClient
}

export type GetRsvpByNameCommandOutput = {
  name: string
  attending: 'yes' | 'no'
  guests: number
  createdAt?: string
  updatedAt?: string
} | null

export const getRsvpByName = async (
  input: GetRsvpByNameCommandInput,
): Promise<GetRsvpByNameCommandOutput> => {
  const { name, tableName, docClient } = input

  // Query DynamoDB using GSI on name
  const result = await docClient.send(
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
      Limit: 1, // Get the most recent RSVP for this name
    }),
  )

  if (!result.Items || result.Items.length === 0) {
    return null
  }

  const item = result.Items[0]
  const { id: _id, ...rsvpData } = item

  return rsvpData as GetRsvpByNameCommandOutput
}
