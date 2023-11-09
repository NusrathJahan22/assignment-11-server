const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)

// const uri = `mongodb+srv://${process.env.DB_PASS}:${process.env.DB_USER}@cluster0.dinkriz.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://addjobsDB:Y1pOfTSnCQ4qPJy7@cluster0.dinkriz.mongodb.net/?retryWrites=true&w=majority`;

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


    const addjobs = client.db('addjobsDB').collection('addjobs')
    const formdetails = client.db('formdetailsDB').collection('formdetails')

    app.post("/addjobs", async (req, res) => {
      const user = req.body
      const result = await addjobs.insertOne(user)
      res.send(result)
    })

    app.get("/addjobs", async (req, res) => {
      const result = await addjobs.find().toArray();
      res.send(result)
    })

    app.delete("/addjobs/:id" ,async (req,res)=>{
      const id =req.params.id;
      console.log("delete" ,id);
      const query ={
        _id: new ObjectId(id)
      };
      const result = await addjobs.deleteOne(query);
      console.log(result);
      res.send(result)
    });

    app.put('/addjobs/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      // const options = { upsert: true }
      const update = req.body
      const Cart = {
        $set: {
          jobtitle: update.jobtitle,
          minimumprice:update.minimumprice,
          maximamprice:update.maximamprice,
          price:update.price,
          email:update.email,
          Category:update.Category,
          deadline:update.deadline,
          description:update.description
        }
      }
      const result = await addjobs.updateOne(filter, Cart);
      res.send(result);
    })

    app.post("/formdetails" , async(req,res) =>{
      const users =req.body
      const result =await formdetails.insertOne(users)
      res.send(result)
    })
    app.post("/formdetails" , async(req,res) =>{
      const users =req.body
      const result =await formdetails.insertOne(users)
      res.send(result)
    })

    app.get('/formdetails' ,async(req,res) =>{
      const result =await formdetails.find().toArray()
      res.send(result)
    })


    app.get('/addjobs/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await addjobs.findOne(query)
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




app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(port, () => {
  console.log(`server is run ${port}`)
})
