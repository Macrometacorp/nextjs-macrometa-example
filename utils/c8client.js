const jsc8 = require('jsc8');
const client = new jsc8(process.env.GDN_URL);
await client.login(process.env.GDN_USERNAME, process.env.GDN_PASSWORD);
client.useFabric(process.env.GDN_FABRIC);

export default client;