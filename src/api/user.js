import api from "@/api/api";

class user {
    static async me(token) {
        return api
            .get('/user/me', {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                return response.data;
            })
    }
}

export default user
