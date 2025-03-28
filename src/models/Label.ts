export class Label {
    constructor(
        private readonly _id: number,
        private readonly _title: string,
    ) {
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }
}
