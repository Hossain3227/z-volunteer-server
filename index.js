const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

const app = express()

const corOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corOptions))
  app.use(express.json())


  

  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.42osioc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const volunteerCollection = client.db('addvolunteer').collection('work')
    const requestCollection = client.db('addvolunteer').collection('request')

    app.get('/volunteer', async (req, res) => {
      const result = await volunteerCollection.find().toArray()

      res.send(result);
    })

    app.get('/volunteer/:id', async (req,res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await volunteerCollection.findOne(query)
      res.send(result);
    })

    //save request 

    app.post('/requests', async (req,res) => {
      const requestData = req.body
      console.log(requestData)
      const result = await requestCollection.insertOne(requestData)
      res.send(result)

      // const result = await requestCollection.updateOne(
      //   {_id:  ObjectId(requestData.requestId) },
      //   {$inc: {volunter_needed: -1} },
      //   {upsert: false}
      // )

      // if (result.modifiedCount === 0){
      //   res.status(400).send({message: 'no volunteer needed'})

      // }
      // else {
      //   const newRequest = await requestCollection.insertOne(requestData)
      //   res.send(newRequest)
      // }
    })

    //save volunteer

    app.post('/volunteer', async (req,res) => {
      const volunteerData = req.body
      console.log(volunteerData)
      const result = await volunteerCollection.insertOne(volunteerData)
      res.send(result)
    })

    //particular user's post

    app.get('/volunteers/:email', async (req, res) => {
      const email = req.params.email 
      const query = {'Organizer.email':email}
      const result = await volunteerCollection.find(query).toArray()
      res.send(result)
    })

    //delete a user's post 

    app.delete('/volunteer/:id', async (req, res) => {
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await volunteerCollection.deleteOne(query)
      res.send(result)
    })
  //update a post 

  app.put('/volunteer/:id', async (req, res) => {
    const id = req.params.id
    const volunteerData = req.body
    const query = {_id: new ObjectId(id)}
    const options = {upsert:true}
    const updateD = {
      $set: {
        ...volunteerData,
      }
    }
    const result = await volunteerCollection.updateOne(query,updateD,options)
    res.send(result)

  })

  //get all request 
  app.get('/all-reqs/:email', async (req, res) => {
    const email = req.params.email 
    const query = {email:email}
    const result = await requestCollection.find(query).toArray()
    res.send(result)
  })

  //cancel a users request 
  app.delete('/requests/:id', async (req, res) => {
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await requestCollection.deleteOne(query)
      res.send(result)
    })


    //pagination work 

    app.get('/all-vols', async (req, res) => {
      
      const size = parseInt(req.query.size)
      const page = parseInt(req.query.page) -1
      console.log(size,page);
      
      const result = await volunteerCollection.find().skip(page*size).limit(size).toArray()


      res.send(result);
    })

    app.get('/vol-sum', async (req, res) => {
      const sum = await volunteerCollection.countDocuments()


      res.send({sum});
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


  app.get('/', (req,res) => {
    res.send('volunteer site is running')
  })

  app.listen(port, () => console.log(`server is running on port ${port}`))