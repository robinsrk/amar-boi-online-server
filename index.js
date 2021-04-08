const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emnwf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("Products");
  const orderInfo = client.db(`${process.env.DB_NAME}`).collection("Orders");
  console.log("connected");
  app.get("/books", (req, res) => {
    bookCollection.find({}).toArray((err, collection) => {
      res.send(collection);
    });
  });
  app.get("/book/:id", (req, res) => {
    bookCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, docuemnts) => {
        res.send(docuemnts);
      });
  });
  app.get("/orders", (req, res) => {
    orderInfo.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    bookCollection.insertOne(newBook).then((result) => {
      console.log(result);
    });
    console.log(req.body);
  });
  app.delete("/delete/:id", (req, res) => {
    bookCollection.deleteOne({ _id: ObjectId(req.params.id) });
  });
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    orderInfo.insertOne(newOrder).then((result) => {
      console.log(result);
    });
  });
});
const port = 3300;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT || port);
