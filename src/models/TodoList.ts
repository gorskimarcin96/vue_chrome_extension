import {TodoTask} from "./TodoTask";

export class TodoList {
    private readonly _id: number | null;
    private readonly _name: string | null;
    private _is_done: boolean | null;
    private readonly _created_at: Date | null;
    private readonly _todo_tasks: TodoTask[];

    constructor(id: number | null = null, name: string | null = null, is_done: boolean | null = false, created_at: Date | null = new Date(), todo_tasks: TodoTask[] = []) {
        this._id = id;
        this._name = name;
        this._is_done = is_done;
        this._created_at = created_at;
        this._todo_tasks = todo_tasks;
    }

    get id(): number | null {
        return this._id;
    }

    get name(): string | null {
        return this._name;
    }

    get is_done(): boolean | null {
        return this._is_done;
    }

    get created_at(): Date | null {
        return this._created_at;
    }

    get todo_tasks(): TodoTask[] {
        return this._todo_tasks;
    }

    change_status(): void {
        this._is_done = !this._is_done;
    }

    add_todo_task(todoTask: TodoTask) {
        this._todo_tasks.push(todoTask);
    }
}
