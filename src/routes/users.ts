import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";
import {
  addAddress,
  changeUserRole,
//   dashboardOverview,
  deleteAddress,
//   getUserSingleById,
  listAddresses,
  listUsers,
  updateUser,
} from "../controllers/users";
// import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
userRoutes.delete("/address/:id",[authMiddleware],errorHandler(deleteAddress));
userRoutes.get("/address", [authMiddleware], errorHandler(listAddresses));
userRoutes.put("/userinfo", [authMiddleware], errorHandler(updateUser));

// userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));
// userRoutes.get(
//   "/:id",
//   [authMiddleware, adminMiddleware],
//   errorHandler(getUserSingleById)
// );
// userRoutes.put(
//   "/:id",
//   [authMiddleware, adminMiddleware],
//   errorHandler(changeUserRole)
// );

// userRoutes.get(
//   "/dashboard/overview",
//   [authMiddleware, adminMiddleware],
//   errorHandler(dashboardOverview)
// );

export default userRoutes;
