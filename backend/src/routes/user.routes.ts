import { Router } from "express";
import {
  deleteUser,
  getUser,
  signin,
  signout,
  signup,
  updateUser,
} from "../controller/user.controller";
import { auth } from "../middlewares/middleware";
import {
  googleCallback,
  googleStart,
} from "../controller/googleAuth.controller";

const userRouter = Router();
userRouter.get("/", (req, res) => {
  res.send("User route is working");
});

userRouter.post("/signup", signup);

userRouter.post("/signin", signin);

userRouter.get("/google", googleStart);

userRouter.get("/google/callback", googleCallback);

userRouter.post("/signout", signout);

userRouter.get("/getUser", auth, getUser);

userRouter.put("/updateUser", auth, updateUser);

userRouter.delete("/deleteUser", auth, deleteUser);

export { userRouter };
