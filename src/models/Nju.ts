export class Nju {
    constructor(private readonly _remainingNet: number, private readonly _totalNet: number, private readonly _createdAt: Date) {
    }

    get remainingNet(): number {
        return this._remainingNet;
    }

    get totalNet(): number {
        return this._totalNet;
    }

    get usedNet(): number {
        return (this._totalNet - this._remainingNet).toFixed(2);
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
