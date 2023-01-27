export class User {
    private readonly _id: number;
    private readonly _email: string;
    private readonly _token: string | null;
    private readonly _exp: number;

    constructor(id: number, email: string, token: string, exp: number) {
        this._id = id;
        this._email = email;
        this._token = exp * 1000 < Date.now() ? null : token;
        this._exp = exp;
    }

    get id(): number {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get token(): string | null {
        return this._token;
    }

    get exp(): number {
        return this._exp;
    }
}
