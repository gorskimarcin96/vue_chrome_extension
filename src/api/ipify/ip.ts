import axios from "axios";

class ip {
    static async get(): Promise<string> {
        return axios
            .get('https://api.ipify.org/?format=json', {timeout: 2500})
            .then((response) => {
                return response.data.ip;
            })
    }
}

export default ip
