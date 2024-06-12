import client from "../../utils/c8client";
import { toProduct } from "../../utils/transform";

export default async function handler(req, res) {
    const docs = await client.getDocumentMany("products");
    res.status(200).json(docs.map(toProduct));
}