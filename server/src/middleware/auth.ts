//middleware to make sure only admin is allowed

import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/utilityClass.js";
import { TryCatch } from "./error.js";

export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Login Id Required", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid LogIn Id", 401));

  if (user.role !== "admin")
    return next(new ErrorHandler("Admin Id Authorised Only", 403));

  next();
});
