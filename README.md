# Macrometa - NEXT.js Example

## Building a Simple Web Application with Next.js and Macrometa's Global Data Network
In this guide, we will demonstrate how to create a simple web application using Next.js, leveraging the power of Macrometa's global data network.

## Video Link

https://drive.google.com/file/d/1bQWsd80oAohCzwkkrL0oxjCL7QBxNk73/view?usp=sharing

### What is Macrometa?
Macrometa is a global data network that integrates a multi-model database, streams, and compute into a single, cohesive platform. It allows developers to build high-performance, globally distributed applications with ease.

### Overview
This example illustrates how to use Macrometa as a backend for your Next.js application through serverless functions.

### Steps:

Set Up Next.js:

- Create a new Next.js project.
- Install necessary dependencies.

Integrate Macrometa:

- Connect your Next.js application to Macrometa.
- Use Macrometa's multi-model database to store and retrieve data.
- Implement serverless functions in Next.js to interact with Macrometa's backend.

- By following this guide, you will learn how to harness the capabilities of Macrometa's global data network to build efficient and scalable web applications with Next.js.

## How to run the example on local machine
Steps to run the example:

```bash
npm install
```

```bash
npm run dev
```

Add your Macrometa credentials to a `.env.local` file in the root directory of the project:

```bash
GDN_URL=<GDN_URL>
GDN_USERNAME=<GDN_USERNAME>
GDN_PASSWORD=<GDN_PASSWORD>
GDN_FABRIC=<GDN_FABRIC>
PRODUCT_COLLECTION=<PRODUCT_COLLECTION>
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Enabling Macrometa integration

Integrating Macrometa with your Next.js application is straightforward using the `jsc8` package. The client code for this integration can be found in the `utils/c8client.js` file.
This file contains the necessary code to create an instance of the Macrometa client, which can then be utilized throughout your application.

Here's a brief overview of what you need to do:

Install the jsc8 package:
```bash
npm install jsc8
```

Create macrometa client instance:
```javascript
const jsc8 = require('jsc8');
const client = new jsc8(process.env.GDN_URL);
await client.login(process.env.GDN_USERNAME, process.env.GDN_PASSWORD);
client.useFabric(process.env.GDN_FABRIC);

export default client;
```

## Utilizing the Macrometa Client in Serverless Functions

With the Macrometa client instance set up, we can now leverage it in our serverless functions to interact with the database. The serverless function code is located in the `pages/api` directory.
For this example, we will demonstrate a simple use case where we manage a collection of products and display them in our application. The code for this serverless function can be found in `pages/api/products.js` and `pages/api/products/[product].js`.
Here’s how to use the Macrometa client in your serverless functions:

```javascript
// File: pages/api/products.js

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
```

```javascript
// File: pages/api/products/[product].js

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
