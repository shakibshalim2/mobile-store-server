const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u4pw7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const app = express()

app.use(cors());
app.use(bodyParser.json());




const port = 4000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("mobileStore").collection("products");
    const orderCollection = client.db("mobileStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)

            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/products/:id', (req, res) => {
        const id = req.params.id;
        productsCollection.find({ _id: ObjectID(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        orderCollection.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })
    app.get('/bookings', (req, res) => {

        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)

            })

    })



});


app.listen(process.env.PORT || port)