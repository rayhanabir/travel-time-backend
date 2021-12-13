const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travels_info");
    const PlaceCollection = database.collection("places");
    const OrderCollection = database.collection("orders");
    // get api to load data in databse

    app.get("/places", async (req, res) => {
      const cursor = PlaceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // check order

    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      console.log(req.query)
      const cursor = OrderCollection.find({email});
      const result = await cursor.toArray();
      console.log(result)
      res.json(result);
    });

    //get all order 

    app.get('/allorders', async(req, res)=>{
      const cursor = OrderCollection.find({});
      const allOrder = await cursor.toArray();
      res.json(allOrder);
    })

    //get a single place(my order ) to get api

    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id:ObjectId(id) };
      const result = await PlaceCollection.findOne(query);
      res.json(result);
    });

    //post a service by post api

    app.post("/places", async (req, res) => {
      const place = req.body;
      const result = await PlaceCollection.insertOne(place);
      res.json(result);
    });

    //order

    app.post("/orders", async (req, res) => {
      const order = req.body;
      // console.log(req.body);
      const result = await OrderCollection.insertOne(order);
      // console.log("order", order);
      res.json(result);
    });

    //delete api to delete order

    app.delete('/allorders/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id:ObjectId(id) };
      const result = await OrderCollection.deleteOne(query);
      res.send(result)

    })

  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running in travel time !");
});

app.listen(port, () => {
  console.log(`runnig port on ${port}`);
});
