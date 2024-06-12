import client from "../../../utils/c8client";
import { toProduct } from "../../../utils/transform";

export default async function handler(req, res) {
    if (req.method) {
        const { product } = req.query;
        try {
            const doc = await client.getDocument("products", product);
            res.status(200).json(toProduct(doc));
        } catch(err) {
            if (err.code == 404) {
                res.status(404).json({ "message": `Could not find produce ${product}`});
            } else {
                res.status(500).json({"message": `Could not retrive product: ${err}`});
            }
        }
    }
}