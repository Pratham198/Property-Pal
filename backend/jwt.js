// const a=require('crypto').randomBytes(64).toString('hex');
// console.log(a);

const mongoose = require('mongoose');

// Replace this with your actual MongoDB URI
// const MONGO_URI = 'mongodb+srv://Pratham:Pratham19@cluster0.2jbwu.mongodb.net/property_pal?retryWrites=true&w=majority&appName=Cluster0';

const MONGO_URI = 'mongodb+srv://Prathamdani:Pratham123@cluster0.rri0u.mongodb.net/property_pal?retryWrites=true&w=majority&appName=Cluster0';
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    } finally {
        mongoose.connection.close();

    }
};

connectToDatabase();


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Prathamdani:Pratham123@cluster0.rri0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

