const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');
const uri =`mongodb+srv://${(process.env.S3_BUCKET)}:${(process.env.SECRET_KEY)}@cluster0.ilovu.mongodb.net/${(process.env.S3_BUCKET_NAME)}?retryWrites=true&w=majority`;

const port = 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products)
    .then(result =>{
      res.send(result.acknowledged)
    });
  });

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    });
  });

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    });
  });

  app.post('/addOrder', (req, res) => {
    const products = req.body;
    ordersCollection.insertOne(products)
    .then(result =>{
      console.log(ordersCollection);
      res.send(result.acknowledged)
    });
  });

});


app.listen(process.env.PORT || port)