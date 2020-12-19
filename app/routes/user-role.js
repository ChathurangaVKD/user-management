const router = require("express").Router();
const UserRoleController = require('../controllers/user-role');
const CheckAuth = require('./../middleware/check-auth');

//get all userRoles
router.get("/get/all", UserRoleController.get_all_user_roles);
//create userRoles
router.post("/create", CheckAuth.ensure_superAdmin_permission, UserRoleController.create_user_roles);

module.exports = router;