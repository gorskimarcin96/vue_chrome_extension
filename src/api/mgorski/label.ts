import api from "./api";
import {Label} from "../../models/Label";

class label {
    static async list(token: string): Promise<Label[]> {
        return api
            .get('/label', {
                headers: {'TOKEN': token}
            })
            .then((response) => {
                let labels = [];
                for (const row of response.data) {
                    labels.push(new Label(
                        row.id,
                        row.title,
                    ));
                }
                return labels;
            })
    }
}

export default label
