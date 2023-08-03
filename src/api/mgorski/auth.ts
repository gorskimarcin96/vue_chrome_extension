import api from "./api";

class auth {
    static async login(email:string, password:string) {
        return api
            .post('/auth', {
                email: email,
                password: password
            })
            .then((response) => {
                return response.data;
            })
    }
}

export default auth
