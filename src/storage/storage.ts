import {User} from "../models/User";
import {IP} from "../models/IP";

abstract class abstractStorage {
    private static storageData: any = {};

    protected static get = async (key: string): Promise<any> => {
        return process.env.NODE_ENV === 'development'
            ? this.storageData[key]
            : new Promise(resolve => chrome.storage.sync.get(key, resolve))
                .then(storageData => key === null ? storageData : storageData[key])
    };

    protected static set(key: string, value: any) {
        process.env.NODE_ENV === 'development'
            ? this.storageData[key] = value
            : chrome.storage.sync.set({[key]: value});
    }
}

class storage extends abstractStorage {
    static async getUser(): Promise<User | null> {
        const data = await this.get('user') ?? null

        return data === null ? null : (data instanceof User ? data : new User(data._id, data._email, data._token, data._exp));
    }

    static setUser(user: null | User): void {
        return this.set('user', user);
    }

    static async getCurrentTab(): Promise<null | string> {
        return await this.get('currentTab') ?? null;
    }

    static setCurrentTab(tab: null | string): void {
        return this.set('currentTab', tab);
    }

    static async getPasswordSearch(): Promise<string | null> {
        return await this.get('passwordSearch') ?? null;
    }

    static setPasswordSearch(search: string): void {
        return this.set('passwordSearch', search);
    }

    static async getWords(): Promise<string[] | null> {
        const data = await this.get('words') ?? [];

        return Array.isArray(data) ? data : Object.values(data);
    }

    static setWords(words: string[]): void {
        return this.set('words', words);
    }

    static async getIPs(): Promise<IP[]> {
        const data = await this.get('ips') ?? [];

        return Array.isArray(data) ? data : Object.values(data);
    }

    static async addIP(ip: string): Promise<void> {
        this.getIPs().then((ips) => {
            ips.push({ip: ip, date: Date.now()})

            this.set('ips', ips ?? [])
        });
    }
}

export default storage
