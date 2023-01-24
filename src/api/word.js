import api from "@/api/api";

class word {
    static async add(token, words) {
        return api
            .post('/word/', words, {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                return response.data;
            })
    }
}

export default word
