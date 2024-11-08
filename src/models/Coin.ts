export class Coin {
    constructor(private readonly _title: string, private readonly _sell: string, private readonly _buy: string, private readonly _dateTime: Date) {
    }

    get title(): string {
        return this._title;
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
