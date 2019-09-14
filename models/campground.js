//Schema setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
    comments: [ //This is an array because when used in the template it makes getting data more simpler
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
//Making a model in the db
module.exports = mongoose.model('Campground', campgroundSchema);