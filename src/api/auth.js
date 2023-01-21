import api from "@/api/api";

class auth {
    static async login(email, password) {
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
