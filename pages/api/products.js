import client from "../../utils/c8client";
import { toProduct } from "../../utils/transform";

const PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION;

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            await createProduct(req, res);
            break;
        default:
            await getProducts(req, res);
            break;
    }
}

async function createProduct(req, res) {
    const newDoc = await client.insertDocument(PRODUCT_COLLECTION, req.body);
    res.status(201).json(toProduct(newDoc));
}

async function getProducts(req, res) {
    const docs = await client.getDocumentMany(PRODUCT_COLLECTION);
    res.status(200).json(docs.map(toProduct));
}
