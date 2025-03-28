export class FormTodo {
    private _title: string;
    private _description: string;
    private _label: number | null;
    private _deadline: Date | null;


    constructor(title: string = '', description: string = '', label: number | null = null, deadline: Date | null = null) {
        this._title = title;
        this._description = description;
        this._label = label;
        this._deadline = deadline;
    }


    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get label(): number {
        return this._label;
    }

    set label(value: number) {
        this._label = value;
    }

    get deadline(): Date {
        return this._deadline;
    }

    set deadline(value: Date) {
        this._deadline = value;
    }
}
