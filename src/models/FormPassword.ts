export class FormPassword {
    private _website: string;
    private _login: string;
    private _description: string;
    private _password: string;

    constructor(
        website: string,
        login: string,
        description: string,
        password: string
    ) {
        this._website = website
        this._login = login
        this._description = description
        this._password = password
    }

    get website(): string {
        return this._website;
    }

    set website(value: string) {
        this._website = value;
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }
}
