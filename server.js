const express = require("express");
const path = require("path");
const { readFromFile, readAndAppend } = require("./helpers/fsUtils");
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await readFromFile("./db/db.json");
    // console.log(JSON.parse(notes));
    res.status(200).json(JSON.parse(notes));
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const newNote = {
      ...req.body,
      id: uuid(),
    };
    await readAndAppend(newNote, "./db/db.json");
    res.status(200).json("We did it!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// GET Route for feedback page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Wildcard route to direct users to a 404 page
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
