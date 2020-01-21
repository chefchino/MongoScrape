var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var newNotes = new Schema ({
    note: {
        type: String
    }
});
var Note = mongoose.model("Note", newNotes);
module.exports = Note;