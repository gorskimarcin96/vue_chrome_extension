export class Currency {
    constructor(private readonly _label: string, private readonly _sell: string, private readonly _buy: string, private readonly _dateTime: Date) {
    }

    get label(): string {
        return this._label;
    }

    get sell(): string {
        return this._sell;
    }

    get buy(): string {
        return this._buy;
    }

    get dateTime(): Date {
        return this._dateTime;
    }
}
