// Backend entry: Express server with MongoDB (Mongoose)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { google } = require('googleapis');
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
// Scam reports route
app.use('/api/scams', require('./routes/scams'));
app.use('/api/teachers', require('./routes/teachers'));

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

// Chatbot endpoint using Google Custom Search API
app.post('/api/chatbot', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const { google } = require('googleapis');
    const customsearch = google.customsearch('v1');

    // Use environment variables for API key and CSE ID
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CSE_ID = process.env.GOOGLE_CSE_ID;

    if (!API_KEY || !CSE_ID) {
      return res.status(500).json({ error: 'Google API configuration missing' });
    }

    const response = await customsearch.cse.list({
      auth: API_KEY,
      cx: CSE_ID,
      q: question,
      num: 1, // Get top result
    });

    const items = response.data.items;
    if (items && items.length > 0) {
      const topResult = items[0];
      const answer = topResult.snippet || topResult.title;
      const link = topResult.link;

      res.json({
        answer: answer,
        link: link,
      });
    } else {
      res.json({
        answer: 'Sorry, I couldn\'t find relevant information for your question. Please try rephrasing or contact support.',
        link: null,
      });
    }
  } catch (error) {
    console.error('Error fetching from Google Custom Search:', error);
    res.status(500).json({ error: 'Failed to fetch answer' });
  }
});

// Fallback to serve index.html for client-side routes
app.use((req, res) => {
  // If request is for API route, skip
  if (req.path.startsWith('/api/')) return res.status(404).json({error:'Not found'});
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, ()=>console.log(`Server running on port ${port}`));
