const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/zoos.db3',
  },
  useNullAsDefault: true,
}
const db = knex(knexConfig)

const server = express();

server.use(express.json());
server.use(helmet());

// GET zoos:
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET /api/zoos/:id:
server.get('/api/zoos/:id', async (req, res) => {
    try {
      const zoo = await db('zoos')
        .where({id: req.params.id})
        .first();
        if (!zoo) {
          res.status(404).json({error: "Zoo with that ID could not be found"})
        } else {
          res.status(200).json(zoo);
        }
    } catch (error) {
      res.status(500).json(error)
    }

})

// POST:
server.post('/api/zoos', async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({error: 'please enter a name!'})
  }
  try {
    const [id] = await db('zoos').insert(req.body);
    const zoo = await db('zoos')
      .where({ id })
      .first();
    res.status(201).json({zoo})
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE:
server.delete("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id})
      .del();
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "zoo not found"})
      }
  } catch (error) {
    res.status(500).json(error)
  }
})

//PUT: 
server.put("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id})
      .update(req.body)

    if (count > 0) {
      const zoo = await db('zoos')
        .where({id: req.params.id})
        .first();

        res.status(200).json(zoo)
    } else {
      res.status(404).json({error: "zoo not found"})
    }
  } catch (error) {
    res.status(500).json(error)
  }
})
const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
