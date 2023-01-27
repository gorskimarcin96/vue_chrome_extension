export class Password {

    private readonly _id: number;
    private readonly _href: string;
    private readonly _domain: string;
    private readonly _login: string;
    private readonly _description: string;

    constructor(
        id: number,
        href: string,
        domain: string,
        login: string,
        description: string
    ) {
        this._id = id
        this._href = href
        this._domain = domain
        this._login = login
        this._description = description
    }

    get id(): number {
        return this._id;
    }

    get href(): string {
        return this._href;
    }

    get domain(): string {
        return this._domain;
    }

    get login(): string {
        return this._login;
    }

    get description(): string {
        return this._description;
    }
}
