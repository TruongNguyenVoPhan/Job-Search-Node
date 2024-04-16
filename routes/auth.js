// auth.js

const express = require('express');
const router = express.Router();
const userModel = require('../schemas/user');
const ResHelper = require('../helper/ResponseHelper');
const userValidator = require('../validators/user');
const { validationResult } = require('express-validator');
const checkLogin = require('../middlewares/checklogin');
const sendMail = require('../helper/sendMail');
const config = require('../configs/config');

router.get('/me', checkLogin, (req, res, next) => {
  ResHelper.RenderRes(res, true, req.user);
});

router.post('/logout', checkLogin, (req, res, next) => {
  if (req.cookies.token) {
    res.status(200)
      .cookie('token', "null", {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
      })
      .send({
        success: true,
        data: result.getJWT()
      });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await userModel.GetCre(req.body.username, req.body.password);
    if (result.error) {
      ResHelper.RenderRes(res, false, result.error);
    } else {
      res.status(200)
        .cookie('token', result.getJWT(), {
          expires: new Date(Date.now() + 24 * 3600 * 1000),
          httpOnly: true
        })
        .send({
          success: true,
          data: result.getJWT()
        });
    }
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

router.post('/register', userValidator.checkChain(), async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      ResHelper.RenderRes(res, false, result.errors);
      return;
    }

    const newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["user"]
    });

    await newUser.save();
    ResHelper.RenderRes(res, true, newUser.getJWT());
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

router.post("/forgotPassword", userValidator.checkChainn(), async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      ResHelper.RenderRes(res, false, result.errors);
      return;
    }

    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const token = user.genTokenResetPassword();
      user.resetPasswordToken = token;
      user.resetPasswordExp = Date.now() + 10 * 60 * 1000; // Token expiration time (e.g., 10 minutes)
      await user.save();

      const resetPasswordUrl = `http://127.0.0.1:5500/html/resetPassword.html?token=${token}`;
      const message = `Click the following link to reset your password: ${resetPasswordUrl}`;
      sendMail(message, user.email);

      ResHelper.RenderRes(res, true, "Reset password link sent successfully.");
    } else {
      ResHelper.RenderRes(res, false, "Email does not exist.");
    }
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

router.post("/ResetPassword/:token", userValidator.checkChainnpass(), async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      ResHelper.RenderRes(res, false, result.errors);
      return;
    }

    const user = await userModel.findOne({ resetPasswordToken: req.params.token });
    if (user) {
      if (user.resetPasswordExp > Date.now()) {
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExp = undefined;
        await user.save();
        ResHelper.RenderRes(res, true, "Password reset successful.");
      } else {
        ResHelper.RenderRes(res, false, "URL expired.");
      }
    } else {
      ResHelper.RenderRes(res, false, "Invalid URL.");
    }
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

router.post("/changePassword", checkLogin, userValidator.checkChainnpass(), async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      ResHelper.RenderRes(res, false, result.errors);
      return;
    }

    const user = await userModel.findOne({ _id: req.user._id });
    if (user) {
      user.password = req.body.password;
      await user.save();
      ResHelper.RenderRes(res, true, "Password changed successfully.");
    } else {
      ResHelper.RenderRes(res, false, "User not found.");
    }
  } catch (error) {
    ResHelper.RenderRes(res, false, error);
  }
});

module.exports = router;