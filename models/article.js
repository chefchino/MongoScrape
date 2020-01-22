var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var newArticle = new Schema({
    title: {
        type: String,
        trim: true,
        required: "String needed"
    },
    links: {
        type: String
    },
    summary: {
        type: String
    },
    photo: {
        type: String
    },
    saved: {
        type:Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
]
});
var Article = mongoose.model("article", newArticle);
module.exports = Article;