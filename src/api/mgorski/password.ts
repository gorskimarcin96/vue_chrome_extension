import api from "./api";
import {Password} from "../../models/Password";
import {FormPassword} from "../../models/FormPassword";

class password {
    static async list(token: string, phrase: string = ''): Promise<Password[]> {
        return api
            .get('/password/?phrase=' + phrase, {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                let passwords = [];
                for (let i = 0; i < response.data.length; i++) {
                    let href = response.data[i].website;
                    let domain = response.data[i].website;

                    try {
                        const url = new URL(response.data[i].website);
                        href = url.href;
                        domain = url.host;
                    } catch (e) {
                    }

                    passwords.push(new Password(
                        response.data[i].id,
                        href,
                        domain,
                        response.data[i].login,
                        response.data[i].description
                    ));
                }

                return passwords;
            })
    }

    static async getPassword(token: string, id: number): Promise<string> {
        return api
            .get('/password/' + id, {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                return response.data.password;
            })
    }

    static async addPassword(token: string, password: FormPassword): Promise<Password> {
        return api
            .post('/password/add', {
                website: password.website,
                password: password.password,
                login: password.login,
                description: password.description,
            }, {
                headers: {
                    'X-AUTH-TOKEN': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                let href = response.data.website;
                let domain = response.data.website;

                try {
                    const url = new URL(response.data.website);
                    href = url.href;
                    domain = url.host;
                } catch (e) {
                }

                return new Password(response.data.id, href, domain, response.data.login, response.data.description);
            })
    }
}

export default password
