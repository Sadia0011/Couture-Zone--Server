const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uok4zlq.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection


        const database = client.db("fashionDB");
        const fashionCollection = database.collection("fashionCollection");

        // const fashionCollection = client.db("fashionDB").collection("fashionCollection");

        app.get("/products", async (req, res) => {
            const cursor = fashionCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/productsById/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = {
                _id: new ObjectId(id)
            };
            const result = await fashionCollection.findOne(query);
            console.log(result);
            res.send(result)
        })

        app.get("/products/:brand", async (req, res) => {
            const brand = req.params.brand;
            // console.log(brand)
            const query = {
                brand: brand
            }
            const result = await fashionCollection.find(query).toArray()
            res.send(result)
        })



        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct)
            const result = await fashionCollection.insertOne(newProduct);
            res.send(result)
        })

        // update
        app.put("/productsById/:id", async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            }
            const options = {
                upsert: true
            }
            const product = req.body;
            const updatedProduct = {
                $set: {
                    photo: product.photo,
                    name: product.name,
                    brand: product.brand,
                    type: product.type,
                    price: product.price,
                    description: product.description,
                    rating: product.rating,
                }
            }
            const result = await fashionCollection.updateOne(filter, updatedProduct, options);
            res.send(result)
        })

        const database2 = client.db("fashionDB");
        const cartCollection = database2.collection("cartCollection");

        app.get("/cart", async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            // console.log(result)
            res.send(result)
        })

        app.post("/cart", async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct)
            const result = await cartCollection.insertOne(newProduct);
            res.send(result)
        })


        app.get("/cart/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {
                _id: new ObjectId(id)
            };
            console.log(query)
            const result = await cartCollection.findOne(query);
            console.log(result);
            res.send(result)
        })


        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id)
            const query = {
                _id: new ObjectId(id)
            }
            const result = await cartCollection.deleteOne(query)
            console.log("i am from delete", result)
            res.send(result)
        })

        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("fashion server is running")
})

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})