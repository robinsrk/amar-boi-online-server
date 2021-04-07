const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url =
  "mongodb+srv://myUser:robinsrk3@cluster0.emnwf.mongodb.net/myDB?retryWrites=true&w=majority";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookCollection = client.db("myDB").collection("Products");
  const userInfo = client.db("myDB").collection("Users");
  console.log("connected");
  app.get("/books", (req, res) => {
    bookCollection.find({}).toArray((err, collection) => {
      res.send(collection);
    });
  });
  app.get("/orders", (req, res) => {
    res.send("done");
  });
  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    bookCollection.insertOne(newBook).then((result) => {
      console.log(result);
    });
    console.log(req.body);
  });
});
const port = 3300;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("Listening to port ", port);
});
