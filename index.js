const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1cvgdrp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('toyDB').collection('toy');

    app.get('/toys', async (req, res) => {
      const { sellerEmail } = req.query;
      console.log(sellerEmail)
      let query = {};
    
      if (sellerEmail) {
        query = { sellerEmail };
      }
    
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const options = {
          projection: {
              toyName: 1,
              toyPhoto: 1,
              sallerName: 1,
              sellerEmail: 1,
              subCategory: 1,
              price: 1,
              rating: 1,
              quantity: 1,
              description: 1
          }
      };
      const result = await toyCollection.findOne(query, options);
      res.send(result);
    });

    app.post('/toys', async (req, res) => {
      const newToy = req.body;
      console.log(newToy)
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    app.put('/toys/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true};
      const updatedToy = req.body;
      const toy = {
        $set:{
          toyName: updatedToy.toyName, 
          price: updatedToy.price, 
          quantity: updatedToy.quantity, 
          description: updatedToy.description
        }
      }
      const result = await toyCollection.updateOne(filter, toy, option);
      res.send(result);
    })

    app.delete('/toys/:id', async(req, res) =>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hiii');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
