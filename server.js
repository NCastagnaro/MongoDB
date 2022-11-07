const MongoClient = require('mongodb').MongoClient  //We can connect to MongoDB through the MogoClient's connect method as shown in this code snippet
const express = require('express')
const bodyParser= require('body-parser')    //body parser is a middleware. They help to tidy up the request object before we use them. express let us use middleware with the use method
const { response } = require('express')
const { request } = require('http')
const app = express()

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))  //The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

//This part is to get the correct link to our database. Most people store their databse on cloud services like MongoDB Atlas, which is free
//We will be using MongoDB Atlas as well. 
//MongoDB connection String: mongodb+srv://NickMongo:Muffins10@cluster0.59twpel.mongodb.net/?retryWrites=true&w=majority

let dbName = 'firstDB'
let dbConnectionString = 'mongodb+srv://NickMongo:Muffins10@cluster0.59twpel.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        let db = client.db(dbName)  //Assigns the client.db(dbName) to 'db' variable so that we can work with our database further down in the codebase
    })

app.get('/', (req,res) => {
    db.collection('rappers').find().toArray()   //This goes to our database, goes to the rappers collection, find all the documents(documents are just objects) in the collection, and turn it into an array. So now we have an array of objects. This whole thing returns the array of objects as a promise
    .then(data => {     //data is holding the array of objects. 
        //This line renders our ejs file, which is just pretty much dynamic HTML and responds with it. render is a method on the response object, similar to how we used res.send,res.sendFile, res.json etc. We have access to methods like these, thanks to express. 
        res.render('index.ejs', {info: data})  //Our array of objects in our database is represented by 'data'. And we gave this a name of info.
     })
    .catch(error => console.error(error))
})

app.post('/addRapper', (req,res) => {
    //with insertOne, whatever we put inside the curly braces is what gets added to the database. 
    db.collection('rappers').insertOne({stageName: request.body.stageName,
    birthName: request.body.birthName,likes:0})
    .then(result => {
        console.log('Rapper Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})



app.listen(3000, () => {
    console.log('running on port 3000')
})