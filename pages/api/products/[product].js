import client from "../../../utils/c8client";
import { toProduct } from "../../../utils/transform";

const PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION;

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT':
            await updateProduct(req, res);
            break;
        case 'DELETE':
            await deleteProduct(req, res);
            break;
        default:
            await getProduct(req, res);
            break;
    }
}

async function getProduct(req, res) {
    const { product } = req.query;
    try {
        const doc = await client.getDocument(PRODUCT_COLLECTION, product);
        res.status(200).json(toProduct(doc));
    } catch(err) {
        if (err.code == 404) {
            res.status(404).json({ "message": `Could not find produce ${product}`});
        } else {
            res.status(500).json({"message": `Could not retrive product: ${err}`});
        }
    }
}

async function updateProduct(req, res) {
    const { product } = req.query;
    delete req.body.id;

    try {
        const doc = await client.updateDocument(PRODUCT_COLLECTION, product, req.body);
        res.status(200).json(toProduct(doc));
    } catch(err) {
        if (err.code == 404) {
            res.status(404).json({ "message": `Could not find produce ${product}`});
        } else {
            res.status(500).json({"message": `Could not retrive product: ${err}`});
        }
    }
}

async function deleteProduct(req, res) {
    const { product } = req.query;
    const deletedDoc = await client.deleteDocument(PRODUCT_COLLECTION, product);
    res.status(200).json(toProduct(deletedDoc));
}
