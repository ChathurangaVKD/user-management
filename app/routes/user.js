const router = require("express").Router();
const UserController = require('../controllers/user');

//get all users
router.get("/get/all", UserController.get_all_users);
//create user
router.post("/create", UserController.user_create);
//get user by id
router.get("/get/:userId", UserController.get_users_by_id);
//user login
router.post("/login", UserController.user_login);
//update user
router.post("/update/:userId", UserController.update_users_details);
//update userRole
router.post("/assign/user-role/:userId/:userRoleId", UserController.assign_user_role);
//delete user
router.delete("/delete/:userId", UserController.user_delete);

module.exports = router;