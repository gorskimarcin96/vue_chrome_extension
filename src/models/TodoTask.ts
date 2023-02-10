export class TodoTask {
    private readonly _id: null | number;
    private readonly _name: null | string;
    private readonly _description: null | string;
    private readonly _file_fn: null | string;
    private _is_done: boolean;
    private readonly _created_at: null | Date;

    constructor(id: null | number = null, name: null | string = null, description: null | string = null, file_fn: null | string = null, is_done: boolean = false, created_at: null | Date = new Date()) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._file_fn = file_fn;
        this._is_done = is_done;
        this._created_at = created_at;
    }

    get id(): null | number {
        return this._id;
    }

    get name(): null | string {
        return this._name;
    }

    get description(): string | null {
        return this._description;
    }

    get file_fn(): string | null {
        return this._file_fn;
    }

    get is_done(): boolean {
        return this._is_done;
    }

    get created_at(): null | Date {
        return this._created_at;
    }

    change_status(): void {
        this._is_done = !this._is_done;
    }
}
