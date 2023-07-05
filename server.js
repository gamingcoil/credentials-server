const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

let db;

app.use(cors()); // Enable CORS for all routes

mongodb.MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('website'); // Specify the database name
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

app.use(express.static('public'));

app.get('/items', (req, res) => {
  db.collection('items')
    .find({})
    .project({ _id: 0, id: 1, title: 1, imageLink: 1, description: 1 })
    .toArray()
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      console.error('Failed to fetch items:', err);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  db.collection('items')
    .findOne({ id: itemId })
    .then(item => {
      if (!item) {
        res.status(404).send('Item not found');
      } else {
        res.json(item);
      }
    })
    .catch(err => {
      console.error('Failed to fetch item:', err);
      res.status(500).send('Internal Server Error');
    });
});
