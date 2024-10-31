// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const User=require('./models/User');
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000','http://192.168.20.251:3000'], // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE',  // Allowed methods
    credentials: true,               // Allow cookies and authentication headers
  }));
app.use(bodyParser.json());


//Express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Using the session secret from .env
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Check if user already exists in your database
  User.findOne({ googleId: profile.id })
      .then(existingUser => {
          if (existingUser) {
              // User already exists, pass the user to done
              return done(null, existingUser);
          }
          // If user doesn't exist, create a new user
          const newUser = new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value // Store profile picture if available
              // password field is not required for Google users
          });

          newUser.save()
              .then(savedUser => done(null, savedUser)) // Pass the newly created user
              .catch(err => done(err)); // Handle any errors
      })
      .catch(err => done(err)); // Handle any errors
}));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user); // Pass the user object
  } catch (err) {
      done(err);
  }
});


// Registration Route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body; // Ensure password is included

  // Add some basic validation
  if (!username || !email || !password) {
      return res.status(400).send('All fields are required.');
  }

  try {
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(201).send('User registered successfully');
  } catch (error) {
      // Handle validation errors specifically
      if (error.name === 'ValidationError') {
          return res.status(400).send(error.message);
      }
      res.status(500).send('Internal server error');
  }
});

app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
