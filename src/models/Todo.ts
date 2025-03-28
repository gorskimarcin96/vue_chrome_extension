export class Todo {
    constructor(
        private readonly _id: number,
        private readonly _title: string,
        private readonly _description: string,
        private readonly _label: string | null,
        private readonly _deadline: Date | null,
        private readonly _createdAt: Date,
    ) {
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get label(): string | null {
        return this._label;
    }

    get deadline(): Date | null {
        return this._deadline;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
