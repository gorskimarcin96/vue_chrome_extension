import api from "./api";
import {Todo} from "../../models/Todo";
import moment from "moment";
import {FormTodo} from "../../models/FormTodo";

class todo {
    static async list(token: string): Promise<Todo[]> {
        return api
            .get('/todo', {
                headers: {'TOKEN': token}
            })
            .then((response) => {
                let todos = [];
                for (const row of response.data) {
                    todos.push(new Todo(
                        row.id,
                        row.title,
                        row.description,
                        row.label,
                        row.deadline ? moment(row.deadline).toDate() : row.deadline,
                        moment(row.createdAt).toDate(),
                    ));
                }
                return todos;
            })
    }

    static async addTodo(token: string, todo: FormTodo): Promise<Todo> {
        return api
            .post('/todo', {
                title: todo.title,
                description: todo.description,
                label: todo.label,
                deadline: todo.deadline,
            }, {
                headers: {
                    'TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => new Todo(
                response.data.id,
                response.data.title,
                response.data.description,
                response.data.label,
                response.data.deadline ? moment(response.data.deadline).toDate() : response.data.deadline,
                moment(response.data.createdAt).toDate(),
            ))
    }

    static async deleteTodo(token: string, id: number): Promise<void> {
        return api.delete('/todo/' + id, {headers: {'TOKEN': token}})
    }
}

export default todo
