import { Router } from "express";
import { userController } from "./user.controller";
import { validateUserFilterParams } from "./user.validation";

const userRouter = Router();

userRouter.get("/users", validateUserFilterParams, userController.getUsers);
userRouter.get("/filters", userController.getFilterOptions);

export { userRouter };
export * from "./entity/user.entity";
export * from "./user.service";
export * from "./user.controller";
export * from "./dto/user.dto";
