import api from "./api";
import moment from "moment/moment";
import {Coin} from "../../models/Coin";

class coin {
    static async list(token: string, title: string, days: number): Promise<Coin[]> {
        return api
            .get('/coin/' + title + '/' + days, {
                headers: {'TOKEN': token}
            })
            .then((response) => {
                let coins = [];
                for (const row of response.data) {
                    coins.push(new Coin(
                        title,
                        Math.round(row.sell).toFixed(2),
                        Math.round(row.buy).toFixed(2),
                        moment(row.datetime).toDate()
                    ));
                }
                return coins;
            })
    }
}

export default coin
