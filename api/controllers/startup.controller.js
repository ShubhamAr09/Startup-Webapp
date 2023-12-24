import csv from "csvtojson";
import Startup from "../models/startup.model.js";
import { errorHandler } from "../utils/error.js";

//create startup
export const createStartUp = async (req, res, next) => {
  try {
    const startup = await Startup.create(req.body);

    return res.status(201).json(startup);
  } catch (error) {
    next(error);
  }
};

//delete startup
export const deleteStartUp = async (req, res, next) => {
  const startup = await Startup.findById(req.params.id);

  if (!startup) {
    return next(errorHandler(404, "Start-Up Not found.."));
  }

  if (req.user.id !== startup.userRef) {
    return next(errorHandler(401, "You can only delete your own Startups!"));
  }

  try {
    await Startup.findByIdAndDelete(req.params.id);
    res.status(200).json("Startup has been deleted!");
  } catch (error) {
    next(error);
  }
};

//update startup
export const updateStartUp = async (req, res, next) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) {
    return next(errorHandler(404, "Start-Up Not found.."));
  }

  if (req.user.id !== startup.userRef) {
    return next(errorHandler(401, "You can only delete your own Startups!"));
  }

  try {
    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStartup);
  } catch (error) {
    next(error);
  }
};

//get startups
export const getStartUp = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return next(errorHandler(404, "Start-Up Not found.."));
    }
    res.status(200).json(startup);
  } catch (error) {
    next(error);
  }
};

//get all startups
export const getStartUps = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || "";

    let query = { StartupName: { $regex: searchTerm, $options: "i" } };

    if (req.query.industry && req.query.industry !== "All") {
      query.IndustryVertical = req.query.industry;
    }

    const startups = await Startup.find(query).limit(limit).skip(startIndex);

    return res.status(200).json(startups);
  } catch (error) {
    next(error);
  }
};
