 const express = require('express');
 const cors = require('cors');
 require('dotenv').config();
 const app = express();
 const port = process.env.PORT  || 5000;
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 app.use(cors())
 app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xknuny0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const countriesCollection = client.db('VoyageVista').collection('countries');
    const touristSpotsCollection = client.db('VoyageVista').collection('touristSpots');

    app.get('/touristSpots',async(req,res)=>{
        const cursor = touristSpotsCollection.find();
        const result= await cursor.toArray();
        res.send(result)

    })
    app.get('/touristSpots/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await touristSpotsCollection.findOne(query);
        res.send(result)
    })
    app.post('/touristSpots', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await touristSpotsCollection.insertOne(newSpot);
      res.send(result)

    })
    app.delete('/touristSpots/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotsCollection.deleteOne(query);
      res.send(result)
    })
    app.put('/touristSpots/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSpot = req.body;
      const spot = {
        $set:{
          image:updateSpot.image,
          tourist_spot_name:updateSpot.tourist_spot_name,
          country_name:updateSpot.country_name,
          location:updateSpot.location,
          short_description:updateSpot.short_description,
          average_cost:updateSpot.average_cost,
          seasonality:updateSpot.seasonality,
          travel_time:updateSpot.travel_time,
          totalVisitorsPerYear:updateSpot.totalVisitorsPerYear,
          user_email:updateSpot.user_email,
          user_name:updateSpot.user_name,
        }
      }
      const result = await touristSpotsCollection.updateOne(filter,spot,options);
      res.send(result);
    })


    app.get('/countries', async (req, res) => {
        const cursor = countriesCollection.find();
        const result = await cursor.toArray();
        res.send(result)
  
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


 app.get('/',(req,res)=>{
    res.send('VoyageVista server is running')
 })
 app.listen(port,()=>{
    console.log(`VoyageVista server is running in port: ${port}`)
 })