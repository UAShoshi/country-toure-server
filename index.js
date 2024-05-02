const express = require('express')
var cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.kckbgvo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tourCollection = client.db("tourDB").collection('tour');

    app.get('/tour', async(req, res) =>{
      const cursor = tourCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/tour/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId (id) }
      const result = await tourCollection.findOne(query);
      res.send(result);
    })

    app.post('/tour', async(req, res) => {
      const newTour = req.body;
      console.log(newTour);
      const result = await tourCollection.insertOne(newTour);
      res.send(result)
    })

    app.put('/tour/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId (id) }
      const options = { upsert: true };
      const updatedTour = req.body;
      const tour = {
        $set:{
          location: updatedTour.location, 
          touristsSpotName: updatedTour.touristsSpotName, 
          countryName: updatedTour.countryName, 
          averageCost: updatedTour.averageCost, 
          travelTime: updatedTour.travelTime, 
          totaVisitorsPerYear: updatedTour.totaVisitorsPerYear, 
          seasonality: updatedTour.seasonality, 
          shortDescription: updatedTour.shortDescription, 
          image: updatedTour.image,
        }
      }
      const result = await tourCollection.updateOne(filter, tour, options);
      res.send(result);
    })
    app.delete('/tour/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId (id) }
      const result = await tourCollection.deleteOne(query);
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
  res.send('Country toure server is runing!')
})

app.listen(port, () => {
  console.log(`Country toure server is runing on port ${port}`)
})