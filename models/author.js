var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var moment = require('moment');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    family_name: {
        type: String,
        required: true,
        max: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    date_of_birth: {
        type: Date
    },
    date_of_death: {
        type: Date
    },
});

// Apply the uniqueValidator plugin to userSchema.
AuthorSchema.plugin(uniqueValidator);

AuthorSchema.virtual('name').get(function(){
    return `${this.family_name} ${this.first_name}`;
});

AuthorSchema.virtual('lifespan').get(function(){
    var lifetime_string='';
    if (this.date_of_birth) {
        lifetime_string=moment(this.date_of_birth).format('MMMM Do, YYYY');
    }
    lifetime_string+=' - ';
    if (this.date_of_death) {
        lifetime_string+=moment(this.date_of_death).format('MMMM Do, YYYY');
    }
    return lifetime_string
});

AuthorSchema.virtual('url').get(function(){
    return '/catalog/author/' + this.slug;
});

AuthorSchema.virtual('date_of_birth_formatted').get(function(){
    return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

AuthorSchema.virtual('date_of_death_formatted').get(function(){
    return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
});

module.exports = mongoose.model('Author', AuthorSchema);