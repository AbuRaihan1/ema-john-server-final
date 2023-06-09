const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.egb4qnz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("emajohn server is running");
});

async function run() {
  try {
    const productsCollection = client.db("emaJohnProductsManage");
    const products = productsCollection.collection("Products");

    // get data from database.
    app.get("/products", async (req, res) => {
      const currentPage = parseInt(req.query.currentPage);
      const perPage = parseInt(req.query.perPage);

      const query = {};
      const cursor = products.find(query);
      const product = await cursor
        .skip(currentPage * perPage)
        .limit(perPage)
        .toArray();
      const count = await products.estimatedDocumentCount();
      res.send({ count, product });
    });
  } finally {
  }
}

run().catch(console.dir);
app.listen(port, () => {
  console.log("server running");
});
