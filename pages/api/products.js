const jsc8 = require('jsc8');
const client = new jsc8("https://yehanp.eng.macrometa.io");

export default async function handler(req, res) {
    await client.login("yehan@test.com", "HelloWorld1!");
    client.useFabric("_system");
    const docs = await client.getDocumentMany("products");
    res.status(200).json(docs);
}