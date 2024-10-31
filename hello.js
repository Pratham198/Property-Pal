// // const a=require('crypto').randomBytes(64).toString('hex');
// // console.log(a);

const mongoose = require('mongoose');

// Replace this with your actual MongoDB URI
//const MONGO_URI = 'mongodb+srv://Pratham:Pratham19@cluster0.2jbwu.mongodb.net/property_pal?retryWrites=true&w=majority&appName=Cluster0';

const MONGO_URI = 'mongodb+srv://Prathamdani:Pratham123@cluster0.rri0u.mongodb.net/property_pal?retryWrites=true&w=majority&appName=Cluster0';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    } finally {
        //mongoose.connection.close(); 
        null
    }
};

connectToDatabase();

