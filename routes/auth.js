const express = require ('express');
const router = express.Router();

const { signup,signin, forgotPassword, resetPassword } = require('../controllers/auth');

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(resetPassword);




module.exports = router ;
