import api from "./api";

class user {
    static async me(token: string) {
        return api
            .get('/user/me', {
                headers: {'TOKEN': token}
            })
            .then((response) => {
                return response.data;
            })
    }
}

export default user
