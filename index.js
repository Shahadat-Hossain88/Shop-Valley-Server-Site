const express = require('express')
const app = express()


const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = "mongodb+srv://shopValley:shahadat1234@cluster0.itqew.mongodb.net/shop-valley?retryWrites=true&w=majority";
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const materialCollection = client.db("shop-valley").collection("material");
  // perform actions on the collection object
  console.log('Database connected')

  app.get('/products', (req, res) => {
    materialCollection.find()
    .toArray((err , items) =>{
        res.send(items)
        console.log('from database', items)
    })
  })

  app.post('/addproduct', (req, res) => {
      const newProduct = req.body;
      console.log('adding product', newProduct);
      materialCollection.insertOne(newProduct)
      .then(result => {
          console.log('insert',result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })
//   client.close();
});
app.delete('deleteProduct/:id',(req,res) => {
    const id = ObjectID(req.params.id);
    console.log('delete id', id);
    materialCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value));

})


app.listen(5055, console.log('listening on 5055'));

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })