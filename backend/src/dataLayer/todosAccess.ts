import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexName = process.env.INDEX_NAME
    ) {

    }

    async getAllTodos(userId: String): Promise<TodoItem[]> {
        console.log(`Getting all todos for user: ${userId}`)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        console.log(`Creating todo item: ${todoItem}`)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        console.log(`inserted to database: ${todoItem.todoId}`)
        return todoItem
    }

    async deleteTodo(todoId: string, userId: String) {
        console.log(`Delete todo item: ${todoId}`)

        await this.docClient
                    .delete({
                        TableName: this.todosTable,
                        Key: {
                        userId,
                        todoId
                        }
                    }).promise()

    }

    async updateTodo(todoId: string, userId: string, name: string, dueDate: string, done: boolean) {
        console.log(`Updating todo item: ${todoId}`)


        await this.docClient
                    .update({
                        TableName: this.todosTable,
                        Key: {
                            userId,
                            todoId
                        },
                        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                        ExpressionAttributeValues: {
                            ':name': name,
                            ':dueDate': dueDate,
                            ':done': done
                        },
                        ExpressionAttributeNames: {
                            '#name': 'name' // workaround for reserved word
                          }
                    }).promise()
    }
}