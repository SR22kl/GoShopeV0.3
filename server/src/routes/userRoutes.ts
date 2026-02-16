import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
  newUser,
} from "../controllers/userController.js";
import { adminOnly } from "../middleware/auth.js";

const userRouter = express.Router();

// route - /api/v1/user/new
userRouter.post("/new", newUser);

// route - /api/v1/user/all
userRouter.get("/all", adminOnly, getAllUser);

// route - /api/v1/user/dynamicId
// userRouter.get("/:id", getUser);
// route - /api/v1/user/dynamicId
// userRouter.delete("/:id", deleteUser);

//⬆️chaining routes- /api/v1/user/dynamicId
userRouter.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default userRouter;
