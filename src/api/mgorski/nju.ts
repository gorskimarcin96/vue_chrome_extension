import api from "./api";
import {Nju} from "../../models/Nju";
import moment from "moment/moment";

class nju {
    static async current(token: string): Promise<Nju> {
        return api
            .get('/nju/current', {
                headers: {'TOKEN': token}
            })
            .then((response) => new Nju(
                response.data.remainingNet,
                response.data.totalNet,
                moment(response.data.createdAt).toDate()
            ))
    }

    static async list(token: string, days: number, isAggregate: boolean = false): Promise<Nju[]> {
        return api
            .get('/nju/' + days + (isAggregate ? '?aggregate=true' : ''), {
                headers: {'TOKEN': token}
            })
            .then((response) => {
                let njuData = [];
                for (const row of response.data) {
                    njuData.push(new Nju(
                        row.remainingNet,
                        row.totalNet,
                        moment(row.createdAt).toDate()
                    ));
                }
                return njuData;
            })
    }
}

export default nju
