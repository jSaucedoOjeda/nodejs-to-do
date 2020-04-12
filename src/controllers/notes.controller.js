const notesController = {};
const Note = require('../models/Note');

notesController.renderNoteForm = (req, res) => {
    res.render('notes/new-note');
}

notesController.createNewNote = async (req, res) => {
    const { title, description } = req.body;
    const newNote = new Note({title, description});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/notes'); 
}

notesController.renderNotes = async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({createdAt:'desc'}).lean();
    // if(notes.length == 0){
    //     req.flash('success_msg', 'you have no notes at the moment, try adding one');
    //     res.redirect('/notes/add');
    // }else{
    //     res.render('notes/all-notes', { notes });
    // }
    res.render('notes/all-notes', { notes });
}


notesController.renderEditForm = async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    if(note.user != req.user.id){
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('/notes');
    }
    res.render('notes/edit-note', { note });
}

notesController.updateNote = async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description} );
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
}

notesController.deleteNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');    
}
module.exports = notesController;