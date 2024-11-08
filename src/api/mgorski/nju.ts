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
}

export default nju
