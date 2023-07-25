const express = require('express')
const cors = require('cors')
const formidableMiddleware = require('express-formidable');





const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.use(formidableMiddleware());

const { MongoClient } = require('mongodb')
const dbInfo = require('./config/dbInfo');

const port = 3000


async function main() {

  const client = new MongoClient(dbInfo.url);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      const db = await client.db(dbInfo.dbName);

      require('./routes')(app, db);

      app.listen(port, () => {
        console.log(`Todo list server listening on port ${port}`)
      })

  } catch (e) {
      console.error(e);
  } finally {
      // Close the connection to the MongoDB cluster
      //await client.close();
  }
}

main().catch(console.error);




