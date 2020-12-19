const UserRole = require('../models/user-role');
const mongoose = require("mongoose");

exports.create_user_roles = (req, res, next) => {
    const userRole = new UserRole({
        _id: new mongoose.Types.ObjectId(),
        userRole: req.body.userRole,
        roleId: req.body.roleId,
    });
    userRole.save()
        .then(result => {
            result
            res.status(201).json({
                message: "UserRole created!",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_all_user_roles = (req, res, next) => {
    UserRole.find()
        .then(result => {
            res.status(200).json({
                userRoles: result,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};