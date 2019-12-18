import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const todosAccess = new TodosAccess()

export async function getAllTodos(userId: String): Promise<TodoItem[]> {
    return todosAccess.getAllTodos(userId)
}

export async function createTodo(userId: string, request: CreateTodoRequest): Promise<TodoItem> {
    let todoItem: TodoItem = {} as TodoItem
    todoItem.createdAt = new Date().toISOString()
    todoItem.done = false
    todoItem.todoId = uuid.v4()
    todoItem.userId = userId
    todoItem.dueDate = request.dueDate
    todoItem.name = request.name
    todoItem.attachmentUrl = `https://${process.env.IMAGES_S3_BUCKET}.s3.amazonaws.com/${todoItem.todoId}`
    return await todosAccess.createTodo(todoItem)
}

export async function deleteTodo(todoId: string, userId: string) {
    return await todosAccess.deleteTodo(todoId, userId)
}

export async function updateTodo(todoId: string, userId: string, req: UpdateTodoRequest) {
    console.log(`Updating todo item: ${todoId}`)

    const { name, dueDate, done } = req

    return await todosAccess.updateTodo(todoId, userId, name, dueDate, done)
}