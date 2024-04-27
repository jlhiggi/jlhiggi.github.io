const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const app = express();

// Middleware
app.use(express.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('Gremlin_database');
    app.locals.db = db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Routes
app.get('/api/user', (req, res) => {
  // Fetch user data from the database
  const db = req.app.locals.db;
  db.collection('users').findOne({ /* query for user */ }, { projection: { password: 0 } })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/api/logout', (req, res) => {
  // Perform logout logic
  // ...
  res.sendStatus(200);
});

app.post('/api/chores', (req, res) => {
  const { title, assignedTo, points } = req.body;

  // Insert the chore into the database
  const db = req.app.locals.db;
  db.collection('chores').insertOne({ title, assignedTo, points, completed: false })
    .then((result) => {
      const insertedChore = result.ops[0];
      
      // Update the user's points in the database
      db.collection('users').updateOne(
        { _id: new ObjectId(assignedTo) },
        { $inc: { points: points } }
      )
        .then(() => {
          res.status(201).json(insertedChore);
        })
        .catch((error) => {
          console.error('Error updating user points:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch((error) => {
      console.error('Error adding chore:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/api/chores', (req, res) => {
  const db = req.app.locals.db;
  db.collection('chores').find({ completed: false }).toArray()
    .then((chores) => {
      res.json(chores);
    })
    .catch((error) => {
      console.error('Error fetching chores:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/api/chores/completed', (req, res) => {
  const db = req.app.locals.db;
  db.collection('chores').find({ completed: true }).toArray()
    .then((completedChores) => {
      res.json(completedChores);
    })
    .catch((error) => {
      console.error('Error fetching completed chores:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.put('/api/chores/:choreId/complete', (req, res) => {
  const choreId = req.params.choreId;
  const db = req.app.locals.db;
  
  // Find the chore and update its completed status
  db.collection('chores').findOneAndUpdate(
    { _id: new ObjectId(choreId) },
    { $set: { completed: true } },
    { returnOriginal: false }
  )
    .then((result) => {
      const completedChore = result.value;
      
      // Update the user's points
      db.collection('users').updateOne(
        { _id: new ObjectId(completedChore.assignedTo) },
        { $inc: { points: completedChore.points } }
      )
        .then(() => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error('Error updating user points:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch((error) => {
      console.error('Error completing chore:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/api/users/points', (req, res) => {
  const db = req.app.locals.db;
  db.collection('users').findOne({ /* query for user */ }, { projection: { points: 1 } })
    .then((user) => {
      res.json({ points: user.points || 0 });
    })
    .catch((error) => {
      console.error('Error fetching user points:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
  });