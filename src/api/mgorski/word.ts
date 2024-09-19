import api from "./api";

class word {
    static async add(token: string, words: string[]) {
        return api
            .post('/word/', words, {
                headers: {'TOKEN': token}
            })
            .then((response) => {
                return response.data;
            })
    }
}

export default word
