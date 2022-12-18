import api from "@/api/api";

class password {
    static async list(token, phrase = '') {
        return api
            .get('/password/?phrase=' + phrase, {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                return response.data;
            })
    }

    static async getPassword(token, id) {
        return api
            .get('/password/' + id, {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                return response.data.password;
            })
    }
}

export default password
