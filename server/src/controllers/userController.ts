import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { User } from "../models/userModel.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utilityClass.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, photo, gender, dob } = req.body;

    let user = await User.findById(_id);

    if (user) {
      res.status(200).json({
        success: true,
        message: `Welcome back, ${user?.name}`,
      });
    }

    if (!_id || !name || !email || !photo || !gender || !dob)
      return next(new ErrorHandler("Please Enter all fields", 400));

    user = await User.create({
      _id,
      name,
      email,
      photo,
      gender,
      dob: new Date(dob),
    });

    res.status(201).json({
      success: true,
      message: `Welcome ${user.name}, your user account has been successfully created`,
      user,
    });
  }
);

export const getAllUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    let users = await User.find({});
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      count: users.length,
      users,
    });
  }
);

export const getUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Inavlid Id", 404));

    res.status(200).json({
      success: true,
      message: `User with id:${id} fetched successfully`,
      user,
    });
  }
);

export const deleteUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user)
      return next(new ErrorHandler(`User with id:${id} not found!`, 404));

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User with id:${id} deleted successfully`,
      user,
    });
  }
);
