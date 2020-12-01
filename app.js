const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const mongoClient = mongo.MongoClient;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 3000;
const objID = mongo.ObjectID;

app.use(express.json());
app.use(cors());

app.get("/students", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').find().toArray();
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.post("/student/create", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').insertOne(req.body);
        res.status(200).json({
            "success": "student created"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/student/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').findOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put("/student/edit/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('students').updateOne({
            _id: objID(req.params.id)
        }, {
            $set: req.body
        });
        res.status(200).json({
            "success": "Student details updated"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete("/student/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('students').deleteOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            "success": "Student deleted"
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


app.get("/mentors", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').find().toArray();
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.post("/mentor/create", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').insertOne(req.body);
        res.status(200).json({
            "success": "mentor created"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/mentor/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').findOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put("/mentor/edit/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('mentors').updateOne({
            _id: objID(req.params.id)
        }, {
            $set: req.body
        });
        res.status(200).json({
            "success": "mentor details updated"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete("/mentor/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('mentors').deleteOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            "success": "mentor deleted"
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


app.listen(port, () => {
    console.log(`app listening at https://localhost:${port}/`)
})