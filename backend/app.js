// Backend entry: Express server with MongoDB (Mongoose)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const VisitorCount = require('./models/VisitorCount');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files from ../frontend for a simple demo
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Simple in-memory / local mongoose connection string for demo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dbt_portal_demo';

mongoose.connect(MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=>console.log('Connected to MongoDB'))
  .catch(err=>console.error('MongoDB connection error',err));

// Routes - keep modular
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/admin', require('./routes/admin'));

// Simple stats endpoint for frontend counters
app.get('/api/stats', async (req,res)=>{
  // In a real app, compute from DB. Return dummy for demo.
  res.json({totalStudents:1200, dbtEnabled:842, volunteers:56, annualAmount:'₹12,40,000'});
});

// Visitor count endpoint
app.get('/api/visitor-count', async (req, res) => {
  try {
    let visitorCount = await VisitorCount.findOne();
    if (!visitorCount) {
      visitorCount = new VisitorCount();
      await visitorCount.save();
    }
    // Increment count
    visitorCount.count += 1;
    await visitorCount.save();
    res.json({ count: visitorCount.count });
  } catch (error) {
    console.error('Error updating visitor count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback to serve index.html for client-side routes
app.get('*', (req, res) => {
  // If request is for API route, skip
  if (req.path.startsWith('/api/')) return res.status(404).json({error:'Not found'});
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, ()=>console.log(`Server running on port ${port}`));
