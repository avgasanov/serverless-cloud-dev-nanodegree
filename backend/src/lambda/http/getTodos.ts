import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getAllTodos } from '../../businessLogic/todos'
import { getUserIdFromEvent } from '../../auth/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log(event)

  const userId = getUserIdFromEvent(event)
  const items = await getAllTodos(userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control;Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
