import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.handler.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import {
  valdiateEmail,
  valdiateLogin,
  valdiateRegister,
  valdiateResetPassword,
} from "../validations/users.schemas.js";
import { restePassword } from "../utils/html.template.js";
import { registerMessage } from "../utils/regsiter.message.js";

import sendMail from "../services/send.email.js";
/**
 * @desc create new user
 * @params POST /api/auth/signup
 * @access PUBLIC
 **/
export const signup = async (req, res, next) => {
  const { username, email, password, firstname, lastname } = req.body;
  // validate regiseter schema
  const { error } = valdiateRegister(req.body);
  if (error) return next(errorHandler(400, `${error.details[0].message}`));
  // check user already exists
  const existUser = await User.find({ $or: [{ email }, { username }] });
  if (existUser.length) return next(errorHandler(409, "user already exists"));
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    firstname,
    lastname,
  });
  try {
    await newUser.save();
    const subject = "Registred account";
      const html = registerMessage();
      // Sending email to the user's email address
      await sendMail("gharsalliabir5@gmail.com", subject, html);
    return res
      .status(201)
      .json({ message: "User created successfully", status: true });
      
  } catch (error) {
    next(error);
  }
};
/**
 * @desc create new user
 * @params POST /api/auth/signin
 * @access PUBLIC
 **/
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // validate login schema
  const { error } = valdiateLogin(req.body);
  if (error) return next(errorHandler(400, `${error.details[0].message}`));
  
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found"));
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));
    
    // Check if the account is validated
    if (!validUser.isValidate) {
      // If the account is not validated, return an error response
      return next(errorHandler(403, "Account is not validated. Please validate your account before logging in."));
    }

    // Generate token
    const token = generateToken(validUser._id, "1h");
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 1000 * 3600 * 10000); 
    
    // Send back response with token and isValidate attribute
    return res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({
        message: "User logged in successfully",
        status: true,
        data: {
          token,
          isValidate: validUser.isValidate // Include isValidate attribute in the response data
        },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc create new user
 * @params POST /api/auth/google
 * @access PUBLIC
 **/
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),

        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save(); //save to the DB
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc forgot password
 * @params PUT /api/v1/auth/forgot-password/
 * @access PRIVTE (owenr of this account)
 **/

export const sendforgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = valdiateEmail(req.body);
    console.log("email", email);
    if (error)
      return res
        .status(400)
        .json({ status: "fail", message: error.details[0].message });

    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "user not found, invalid email" });
    }
    const token = generateToken(existUser._id, "1h");

    const subject = "Forgot password";

    const link = `${process.env.BASE_URL_CLIENT}/auth/password-reset/${existUser._id}/${token}/`;

    const html = restePassword(existUser._id, token);
    const expiryDate = new Date(Date.now() + 3600000);
    await sendMail(email, subject, html);
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      })
      .json({
        status: "sucess",
        message: "password reset link sent to your email account",
      });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
    throw new Error(`error verfied account ${error}`);
  }
};

/**
 * @desc create new password
 * @params POST /api/v1/auth/password-reset/:id/
 * @access PRIVTE (owenr of this account)
 **/

export const createNewPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    console.log("req.body", req.body);
    const existUser = await User.findById(id);
    if (!existUser)
      return res
        .status(404)
        .json({ status: "fail", message: "invalid id, user not found" });

    const { error } = valdiateResetPassword(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "fail", message: error.details[0].message });

    const checkOwener = id === req.user.id.toString();
    if (!checkOwener)
      return res
        .status(401)
        .json({ status: "fail", message: "you are not owner of this account" });
    // crypt password
    const salt = bcryptjs.genSaltSync(10); // alg of crypt
    const hash = bcryptjs.hashSync(password, salt);

    await User.findByIdAndUpdate(id, { password: hash });

    return res
      .status(200)
      .json({ status: "success", message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
    throw new Error(`createNewPassword error ${error}`);
  }
};

/**
 * @desc signout
 * @params POST /api/auth/signout
 * @access PRIVITE (user login)
 **/
export const signout = (req, res, next) => {
  try {
    console.log("signout");
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Signout success!", status: true });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc Get information about the current user
 * @params GET /api/auth/current-user
 * @access PRIVATE (user logged in)
 **/
/**
 * @desc Get information about the current user
 * @params GET /api/auth/current-user
 * @access PRIVATE (user logged in)
 **/
/**
 * @desc Get information about the current user
 * @params GET /api/auth/current-user
 * @access PRIVATE (user logged in)
 **/
export const usercurrent = async (req, res, next) => {
  try {
    // Retrieve current user ID from the request object
    const { id } = req.user;

    // Fetch user details from the database based on the user ID
    const currentUser = await User.findById(id);

    // Return user information in the response
    return res.status(200).json({ status: true, data: currentUser });
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
};

