const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controller');

router.post('/', journalController.createJournal);
router.get('/:userId', journalController.getUserJournals);
router.put('/:id', journalController.updateJournal);   // update
router.delete('/:id', journalController.deleteJournal); // delete
module.exports = router;

