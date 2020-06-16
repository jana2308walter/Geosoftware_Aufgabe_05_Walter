const express = require('express');
const mongodb = require('mongodb');
const port = 3000;
const app = express();

app.use (express.json());
app.use (express.urlencoded({extended: true}));

async function connectMongoDB () 
{
    try 
	{
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});
        app.locals.db = await app.locals.dbConnection.db("itemdb");
        console.log("Using db: " + app.locals.db.databaseName);
    }
    catch (error) 
	{
        console.dir(error)
        setTimeout(connectMongoDB, 3000)
    }
}
connectMongoDB()

app.use('/public', express.static(__dirname + '/public'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.get('/', (req, res) => {res.sendFile(__dirname + '/draw.html')})
app.get('/', (req, res) => {res.sendFile(__dirname + '/index.html')})

app.get("/item", (req,res) => 
{
	app.locals.db.collection('items').find({}).toArray((error, result) => 
	{
		if (error) 
		{
			console.dir(error);
		}
		res.json(result);
	});
});

app.post("/item", (req, res) => 
{
    console.log("insert item " + JSON.stringify(req.body));
    app.locals.db.collection('items').insertOne(req.body, (error, result) => 
	{
        if (error) 
		{
            console.dir(error);
        }
        res.json(result);
    });
});

app.delete("/item", (req, res) => 
{
    console.log("delete item" + JSON.stringify(req.body));
    req.body = {_id : new mongodb.ObjectID(req.body._id)};
    app.locals.db.collection('items').deleteOne(req.body, (error, result) => 
	{
		if (error)
		{
			console.dir(error);
		}
		res.json(result)
    });
});

app.listen(port,() => console.log(`Example app listening at http://localhost:${port}`))