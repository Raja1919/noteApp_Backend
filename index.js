require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors")
const notes=require("./Routes/note.js");
const auth=require("./Routes/authendication.js");
const verifyToken = require("./middleware.js");


const PORT = process.env.PORT || 9000;

const app = express();

app.use(express.json());

app.use(cors())

app.use('/api/notes', verifyToken, notes);
app.use('/api/user',auth)


const mongoDBURL = process.env.MONGO_URL;

mongoose
  .connect(mongoDBURL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
