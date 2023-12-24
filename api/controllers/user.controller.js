import Startup from "../models/startup.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API route",
  });
};

//update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized Access!!!"));
  try {
    const existingUserWithEmail = await User.findOne({ email: req.body.email });
    const existingUserWithUsername = await User.findOne({
      username: req.body.username,
    });

    if (
      existingUserWithEmail &&
      existingUserWithEmail._id.toString() !== req.params.id
    ) {
      return res.status(400).json({
        success: false,
        message: "That email is already taken! Try another.",
      });
    }

    if (
      existingUserWithUsername &&
      existingUserWithUsername._id.toString() !== req.params.id
    ) {
      return res.status(400).json({
        success: false,
        message: "That username is already taken! Try another.",
      });
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized Access!!!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User Deleted Successfully!");
  } catch (error) {
    next(error);
  }
};

//get user startups
export const getUserStartups = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    const startups = await Startup.find({ userRef: req.params.id });
    res.status(200).json(startups);
  } else {
    return next(errorHandler(401, "Unauthorized Access!!!"));
  }
};
