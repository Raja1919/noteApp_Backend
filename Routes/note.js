const express = require('express');
const router = express.Router();
const Note = require('../Models/note');

// Get all notes
router.get('/get', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new note
router.post('/post', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send('Title and content are required');
    }

    const newNote = new Note({ title, content });
    await newNote.save();

    res.json(newNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a note
router.put('/update/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send('Title and content are required');
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).send('Note not found');
    }

    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a note
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).send('Note not found');
    }

    res.json(deletedNote);
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
