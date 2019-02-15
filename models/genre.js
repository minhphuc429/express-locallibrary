var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: {
        type: String,
        min: 3,
        max: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

// Apply the uniqueValidator plugin to userSchema.
GenreSchema.plugin(uniqueValidator);

GenreSchema.virtual('url').get(function(){
    return '/catalog/genre/' + this.slug;
});

module.exports = mongoose.model('Genre', GenreSchema);