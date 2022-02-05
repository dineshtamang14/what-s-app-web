import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

// app config 
const app = express();
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1343115",
    key: "a8a64b2d8bf882de2893",
    secret: "da70fb158205f75a6614",
    cluster: "ap2",
    useTLS: true
  });

// middleware
app.use(express.json());

// Cors Header 
app.use(cors());
// app.use((req,  res, next) => {
//     res.setHeader("Access-Control-Allow-origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     next();
// });

// DB config 
const connection_url = "mongodb+srv://dinesh:dinesh1997@cluster0.cuuqa.mongodb.net/whatsApp-DB?retryWrites=true&w=majority"
mongoose.connect(connection_url, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection

db.once("open", () => {
    console.log("DB is connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change);

        if(change.operationType == 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                messages: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            }); 
        } else {
            console.log("Erro triggering Pusher");
        }
    });
});

// api routes
app.get("/", (req, res)=>res.status(200).send("hello, World!"));

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

app.post('/messages/new', (req, res)=>{
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.listen(port, () => console.log(`Listening on localhost: ${port}`))

