import {TodoList} from "../../models/TodoList";
import {TodoTask} from "../../models/TodoTask";
import api from "./api";
import moment from "moment";

class todo {
    static async list(token: string): Promise<TodoList[]> {
        return api
            .get('/todo/', {
                headers: {
                    'TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                let todos = [];
                for (const list of response.data) {
                    let tasks = [];
                    for (const task of list.tasks) {
                        tasks.push(new TodoTask(
                            task.id,
                            task.name,
                            task.description,
                            task.file_fn ? `${import.meta.env.VITE_BACKEND_URL}/upload/TodoTask/${task.file_fn}` : null,
                            task.is_done,
                            moment(task.created_at).toDate())
                        );
                    }
                    todos.push(new TodoList(list.id, list.name, list.is_done, moment(list.created_at).toDate(), tasks))
                }
                return todos;
            })
    }

    static async addList(token: string, todoList: TodoList): Promise<TodoList> {
        return api
            .post('/todo/list', {
                name: todoList.name
            }, {
                headers: {
                    'TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                return new TodoList(
                    response.data.id,
                    response.data.name,
                    response.data.is_done,
                    moment(response.data.created_at).toDate(),
                    response.data.todo_tasks
                );

            });
    }

    static async addTask(token: string, todoList: TodoList, todoTask: TodoTask): Promise<TodoTask> {
        return api
            .post(`/todo/task/${todoList.id}`, {
                name: todoTask.name,
                description: todoTask.description,
            }, {
                headers: {
                    'TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                return new TodoTask(
                    response.data.id,
                    response.data.name,
                    response.data.description,
                    response.data.file_fn,
                    response.data.is_done,
                    moment(response.data.created_at).toDate()
                );

            })
    }

    static async changeTaskStatus(token: string, todoList: TodoList): Promise<TodoTask> {
        return api
            .put(`/todo/task/${todoList.id}/status`, {}, {
                headers: {
                    'TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                return new TodoTask(
                    response.data.id,
                    response.data.name,
                    response.data.description,
                    response.data.file_fn,
                    response.data.is_done,
                    moment(response.data.created_at).toDate()
                );
            })
    }

    static async changeListStatus(token: string, todoList: TodoList): Promise<TodoList | string> {
        return api
            .put(`/todo/list/${todoList.id}/status`, {}, {
                headers: {
                    'TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                return new TodoList(
                    response.data.id,
                    response.data.name,
                    response.data.is_done,
                    moment(response.data.created_at).toDate(),
                    response.data.todo_tasks
                );
            }).catch(function () {
                return 'You cannot change status';
            });
    }
}

export default todo
