import type { APIGatewayProxyResult } from 'aws-lambda'

export const createApiResponse = (
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {},
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      ...headers,
    },
    body: JSON.stringify(body),
  }
}
