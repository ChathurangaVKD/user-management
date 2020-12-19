const mongoose = require('mongoose');

const userRoleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    roleId: {type:Number, required:true},
    userRole:{type:String, required:true}, //Super-Admin, Guest, Agent, Team-Lead, Manager
},
{
  timestamps: true
});

module.exports = mongoose.model('UserRole', userRoleSchema);