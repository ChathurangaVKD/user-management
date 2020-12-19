const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const async = require('async');
const User = require("../models/user");
const UserRole = require("../models/user-role");

exports.user_create = (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email address exists"
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          name: req.body.name,
          birthDay: req.body.birthDay,
          department: req.body.department
        });
        user.save()
          .then(result => {
            res.status(201).json({
              user: {
                _id: result._id,
                email: result.email,
                department: result.department,
                birthDay: result.birthDay,
                name: result.name,
                status: result.status
              },
              Message: "User created"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    });
};

exports.get_all_users = (req, res, next) => {
  User.aggregate([
    {
      "$lookup":
      {
        "from": "userroles",
        "localField": "userRole.roleId",
        "foreignField": "roleId",
        "as": "userRole"
      }
    }
  ])
    .then(docs => {
      const response = {
        count: docs.length,
        Users: docs
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.user_login = (req, res, next) => {
  User.aggregate([
    {
      "$lookup":
      {
        "from": "userroles",
        "localField": "userRole.roleId",
        "foreignField": "roleId",
        "as": "userRole"
      }
    }
  ])
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      else if (user[0].status === 'Banned') {
        return res.status(401).json({
          message: "Your Account has been blocked"
        });
      }
      else if (user[0].status === 'Inactive') {
        return res.status(401).json({
          message: "Your Account is Inactive"
        });
      }
      else {

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                name: user[0].name,
                department: user[0].department,
                birthDay: user[0].birthDay,
                userRole: user[0].userRole
              },
              'Aacadaakjfaejncajqennakncajkandjnmadnahdajncaldja',
              {
                expiresIn: "24h"
              }
            );

            //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkc2ZkZmRzZGZAZ21haWwuY29tIiwidXNlcklkIjoiNWI3ODI4NTJiOThmMjUwMDA0NzBiMGE5IiwiaWF0IjoxNTM0NjAzMTgzLCJleHAiOjE1MzQ2MDY3ODN9.rNSSx605rePEiO4c1pujh81I81_RXpJKXP5rIdU0xGw';

            return res.status(200).json({
              message: "Auth successful",
              token: token,
              user: {
                _id: user[0]._id,
                email: user[0].email,
                name: user[0].name,
                department: user[0].department,
                birthDay: user[0].birthDay,
                userRole: user[0].userRole
              }
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });

      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.get_users_by_id = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          user: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.update_users_details = (req, res, next) => {
  const id = req.params.userId;
  //console.log("user details update");
  const updateOps = {
    email: req.body.email,
    name: req.body.name,
    birthDay: req.body.birthDay,
    department: req.body.department
  };
  User.update(
    { _id: id },
    { $set: updateOps })
    .exec()
    .then(result => {
      result
      res.status(200).json({
        message: "User updated",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.assign_user_role = (req, res, next) => {
  const userRoleId = req.params.userRoleId;
  //console.log("user details update");
  UserRole.findById(userRoleId)
    .then(userRoleResult => {
      console.log(userRoleResult)
      const updateOps = {
        userRole: userRoleResult
      }
      const userId = req.params.userId;
      User.update(
        { _id: userId },
        { $set: updateOps })
        .exec()
        .then(result => {
          result
          res.status(200).json({
            message: "User Role assigned successfully!",
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};