const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    name:{ type: String, required: false },
    birthDay:{ type: String, required: false },
    department:{type:String, required: false},
    userRole:{type:Object, required:false}, //Super-Admin, Guest, Agent, Team-Lead, Manager
    status:{type:String, required:false, default:"Active"},//Active, Inactive, Banned, default:"Active"
    email: { 
        type: String, 
        required: false, 
        unique: false,
        lowercase: false, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: false },
    reset_password_token: {type: String, required: false},
    reset_password_expires: {type: Date, required: false}
},
{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);