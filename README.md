
# Building a Simple Web Application with Next.js and Macrometa's Global Data Network
This guide demonstrates how to create a simple web application using Next.js, leveraging the power of Macrometa's distributed global data network as the backend for storing and interacting with your application data.

## Video Link
[Watch this in practice](https://drive.google.com/file/d/1bQWsd80oAohCzwkkrL0oxjCL7QBxNk73/view?usp=sharing)

## About Macrometa?
Macrometa is a global data network that integrates a multi-model database, streams, and compute into a single, cohesive platform. It allows developers to build high-performance, globally distributed applications with ease.

## Overview
This example illustrates how to use Macrometa as a backend for your Next.js application with serverless functions. The architecture of our web application is as follows:
- Next.js serves the static pages and handles client-side interactions.
- Macrometa GDN offers its distributed edge data centers as the backend, handling product and customer real-time updates to the application.
- Serverless applications interact with the Macrometa GDN and handle business logic functions like updating inventory and customer data.

## Steps:
At a high level, this guide follows three steps:
1. Setting up a Next.js app
2. Connecting your Next.js application to the Macrometa distributed multi-modal database to store and retrieve data.
3. Implementing serverless functions in Next.js to interact with Macrometa's backend and perform business logic like updating records.

### Step 1: Setting up Next.js app
1. Open your terminal and navigate to the directory you'd like to create the application.
2. Follow [these steps](https://nextjs.org/learn-pages-router/basics/create-nextjs-app/setup) to initialize and create a sample Next.js app.
3. Navigate to your app folder and run the following command to start the Next.js development server
```bash
npm run dev
```

### Step 2: Integrating Macrometa with Next.js app

Follow these steps to run from your local machine:
1. Navigate to the app directory and run
```bash
npm install
```

```bash
npm run dev
```
2. Add your Macrometa credentials to a `.env.local` file in the root directory of the project.  

```bash
GDN_URL=<GDN_URL>   //your Macrometa GDN URL
GDN_USERNAME=<GDN_USERNAME> // your Macrometa username
GDN_PASSWORD=<GDN_PASSWORD>  // password
GDN_FABRIC=<GDN_FABRIC>  // GDN fabric. 
PRODUCT_COLLECTION=<PRODUCT_COLLECTION>  //name of product collection
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. Install the `jsc8` package to integrate our Next.js app to Macrometa GDN. The client code for this integration can be found in the `utils/c8client.js` file and contains the necessary code to create an instance of the Macrometa client, which can then be utilized throughout your application.
```bash
npm install jsc8
```
5. Create a Macrometa client instance

```javascript
const jsc8 = require('jsc8');
const client = new jsc8(process.env.GDN_URL);
await client.login(process.env.GDN_USERNAME, process.env.GDN_PASSWORD);
client.useFabric(process.env.GDN_FABRIC);

export default client;
```

### Step 3: Using the Macrometa Client for Serverless Functions

With the Macrometa client instance set up, we can now leverage it in our serverless functions to interact with the database. The serverless function code is located in the `pages/api` directory.
For this example, we will demonstrate a simple use case where we manage a collection of products and display them in our application. The code for this serverless function can be found in `pages/api/products.js`.

Here’s how to use the Macrometa client in your serverless functions

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
```

This function code demonstrates how to perform CRUD operations on our products from the GDN collection. A [GDN collection](https://www.macrometa.com/docs/collections/) stores different kinds
