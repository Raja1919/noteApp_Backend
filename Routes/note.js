const express = require("express");
const router = express.Router();
const Note = require("../Models/note");

// Get all notes
router.get("/get", async (req, res) => {
  try {
    const notes = await Note.find({ user_id: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error("Error reading notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new note
router.post("/post", async (req, res) => {
  try {
    const { title, content, date } = req.body;

    if (!title || !content || !date) {
      return res.status(400).send("Title and content are required");
    }

    const newNote = new Note({ title, content, date });
    await newNote.save();
    res.json({ msg: "Created a Note" });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a note
router.put("/update/:id", async (req, res) => {
  try {
    const { title, content, date } = req.body;

    if (!title || !content || date) {
      return res.status(400).send("Title and content are required");
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, date },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).send("Note not found");
    }

    res.json({ msg: "Updated a Note" });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a note
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).send("Note not found");
    }

    res.json({ msg: "Deleted a Note" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a specific note by ID
router.get("/get/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error reading note:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;


module.exports = router;
