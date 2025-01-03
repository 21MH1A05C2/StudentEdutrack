import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import MongoStore from 'connect-mongo'; 
import User from './models/user';
const app = express();
//const MongoStore = connectMongo(session);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb+srv://rsanthu360:nLFem8TsXut2MvDr@cluster0.kinumr6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Multer Config for File Uploads to MongoDB Atlas GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Session setup with MongoDB storage
const sessionStore = MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions', // Specify the collection name to store sessions
    autoRemove: 'native', // Automatically remove expired sessions
    ttl: 24 * 60 * 60, // Session expiration time in seconds (1 day)
});

app.use(
    session({
      secret: 'monkey', 
      resave: false,
      saveUninitialized: false,
      store: sessionStore, // Use connect-mongo for session storage
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Session expiration time (1 day)
      }
    })
  );

// POST endpoint for user registration
app.post('/users', upload.single('profilepic'), async (req, res) => {
    try {
        const { name, rollno, college, branch, email ,password } = req.body;
        const profilepic = req.file.buffer; // File buffer from multer (for storing in MongoDB Atlas GridFS)

        const newUser = new User({ name, rollno, college, branch, email,password,profilepic });
        await newUser.save();

        res.status(200).send('User registered successfully');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('An error occurred while registering user');
    }
});
// POST endpoint for user login
app.post('/login', async (req, res) => {
    const { rollno, password } = req.body;

    try {
        // Find user by roll number
        const user = await User.findOne({ rollno });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Store user data in session
        req.session.user = user;

        res.status(200).json({ message: 'Login successful',  rollno: user.rollno });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
const protectRoute = (req, res, next) => {
    if (req.session.user) {
      // User is authenticated, allow access to the route
      next();
    } else {
      // User is not authenticated, redirect to login page
      res.redirect('/login');
    }
  };
// Protected route example - Student dashboard
app.get('/studentdashboard', protectRoute, (req, res) => {
    // Only authenticated users can access this route
    res.send('Welcome to the student dashboard!');
});
// Middleware for admin dashboard
const protectAdminRoute = (req, res, next) => {
    const adminRollNumber = "YDP12"; // Fixed admin roll number

    // Check if the user is authenticated and is an admin
    if (req.session && req.session.user && req.session.user.rollno === adminRollNumber) {
        // User is admin, allow access to the route
        next();
    } else {
        // User is not authenticated or not an admin, send forbidden error
        res.status(403).send('Access Forbidden: Only admin users can access this page.');
    }
};

// Admin dashboard route
app.get('/admindashboard', protectAdminRoute, (req, res) => {
    // Only authenticated admin users can access this route
    res.send('Welcome to the admin dashboard!');
});

// Catch-all route - redirect to login page for any other routes
// app.get('*', (req, res) => {
//     res.redirect('/login');
// });
// GET endpoint to fetch all data from the "results" collection
app.get('/getuser/:rollno', async (req, res) => {
    const { rollno } = req.params; // Extract roll number from URL parameter
    try {
        // Fetch the user with the specified roll number
        const user = await User.findOne({ rollno }, 'profilepic');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the profile picture as JSON response
        res.status(200).json({ profilepic: user.profilepic });
        // res.status(200).json({ email: user.email });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// API endpoint to fetch results based on roll number and semester
app.get('/getmarks/:rollno/:semester', async (req, res) => {
  const { rollno, semester } = req.params; // Extract roll number and semester from URL parameters

  try {
      // Find the result for the specified roll number
      const result = results_list.find(student => student.rollno === rollno);

      if (!result) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Find the semester marks for the specified semester
      const semesterResult = result.academicRecord.semesters.find(sem => sem.semester === semester);

      if (!semesterResult) {
          return res.status(404).json({ message: 'Semester not found for this user' });
      }

      // Return the semester details as JSON response
      res.status(200).json(semesterResult);
  } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});