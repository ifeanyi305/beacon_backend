const express = require("express");
const router = express.Router();


const {
  CreateAccount,
  Register,
  previousChats,
  SingleUserByID,
  twoFacAuth,
  twoFacAuthVerify,
  mentionUsers
} = require("../controller/userController");

router.post("/signup", CreateAccount);
router.post("/register", Register);
router.get("/previus-chats", previousChats);
router.post("/profile/:id", SingleUserByID);
router.get("/2fa", twoFacAuth);
router.post("/2fa/verify", twoFacAuthVerify);
router.use("/mention-user",mentionUsers)


module.exports = router;
