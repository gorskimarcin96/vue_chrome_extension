import api from "./api";
import {Currency} from "../../models/Currency";
import moment from "moment/moment";

class currency {
    static async list(token: string, currency: string, days: number): Promise<Currency[]> {
        return api
            .get('/currency/' + currency + '/' + days, {
                headers: {'X-AUTH-TOKEN': token}
            })
            .then((response) => {
                let currencies = [];
                for (const row of response.data) {
                    currencies.push(new Currency(
                        currency,
                        (Math.round(row.sell * 10000) / 10000).toFixed(4),
                        (Math.round(row.buy * 10000) / 10000).toFixed(4),
                        moment(row.datetime).toDate()
                    ));
                }
                return currencies;
            })
    }
}

export default currency
