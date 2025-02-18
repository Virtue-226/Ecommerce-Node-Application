import { Request, Response } from "express";
import {
  AddressSchema,
  UpdateUserSchema,
  changeUserRoleSchema,
} from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Address, User } from "@prisma/client";
import { prismaCilient } from "..";
// import { successResponse } from "../Responses/successresponse"; 
// import { BadRequestsException } from "../";
import { successResponse } from "../Responses/successresponse";
import { BadRequestException } from "../exceptions/badRequest";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  // let user:User;
  // try {
  //  await prismaCilient.user.findFirstOrThrow({
  //    where: {
  //      id: req.body.userId,
  //    },
  //  });
  // }catch(error){
  //  throw new NotFoundException("Address not found.",ErrorCode.ADDRESS_NOT_FOUND)
  // }
  // let userId = req.user?.id;

  const address = await prismaCilient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  console.log(address, "address")

  res.json(address);
  // return successResponse(res, address, "Address added successfully");
};

export const deleteAddress = async (req: Request, res: Response) => {
  let userId = req.user?.id;
  let addressId = req.params.id;

  const address = await prismaCilient.address.findUnique({
    where: {
      id: Number(addressId),
    },
  });

  if (!address || address.userId !== userId) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }

  await prismaCilient.address.delete({
    where: {
      id: Number(addressId),
    },
  });

  res.json({ message: "Address deleted successfully" });
};

export const listAddresses = async (req: Request, res: Response) => {
  let userId = req.user?.id;

  const addresses = await prismaCilient.address.findMany({
    where: {
      userId: userId,
    },
  });

  return successResponse(res, addresses, "Addresses fetched successfully");
};

export const updateAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  let userId = req.user?.id;
  let addressId = req.params.id;

  const address = await prismaCilient.address.findUnique({
    where: {
      id: Number(addressId),
    },
  });

  if (!address || address.userId !== userId) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }

  const updatedAddress = await prismaCilient.address.update({
    where: {
      id: Number(addressId),
    },
    data: {
      ...req.body,
    },
  });

  return successResponse(res, updatedAddress, "Address updated successfully");
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  // console.log(validatedData);
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaCilient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found.",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }
  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaCilient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found.",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  const updatedUser = await prismaCilient.user.update({
    where: {
      id: req.user.id,
    },
    data: validatedData,
  });
  res.json(updatedUser);
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    //query params: page, limit, sort, filter
    let page = req.query.page ? Number(req.query.page) : 1;
    let limit = req.query.limit ? Number(req.query.limit) : 10;
    let sort = req.query.sort ? String(req.query.sort) : "id";
    let filter = req.query.filter ? String(req.query.filter) : "";
    let skip = (page - 1) * limit;

    const users = await prismaCilient.user.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        [sort]: "asc",
      },
      where: {
        email: {
          contains: filter,
        },
      },
    });

    const pagedInfo = {
      page: page,
      limit: limit,
      hasPrevious: page > 1,
      hasNext: users.length == limit,
      totalCount: users.length,
    };

    return successResponse(
      res,
      { pagedInfo, data: users },
      "Users fetched successfully"
    );
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};

// export const getUserSingleById = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     const user = await prismaCilient.user.findFirst({
//       where: {
//         id: Number(userId),
//       },
//       include: {
//         addresses: true,
//       },
//     });

//     if (!user) {
//       throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
//     }

//     // Remove the password field from the user object
//     const { password, ...userWithoutPassword } = user;

//     return successResponse(
//       res,
//       userWithoutPassword,
//       "User fetched successfully"
//     );
//   } catch (error) {
//     throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
//   }
// };

export const changeUserRole = async (req: Request, res: Response) => {
  changeUserRoleSchema.parse(req.body);
  const userId = req.params.id;
  const role = req.body.role;

  const user = await prismaCilient.user.findFirst({
    where: {
      id: Number(userId),
    },
  });

  if (user?.role === role) {
    throw new BadRequestException(
      "Role is already the same",
      ErrorCode.ROLE_ALREADY_SAME
    );
  }

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const updatedUser = await prismaCilient.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      role: role,
    },
  });

  return successResponse(res, updatedUser, "User role updated successfully");
};

// dashboard overview of users, products, orders
// export const dashboardOverview = async (req: Request, res: Response) => {
//   try {
//     const users = await prismaCilient.user.count();
//     const products = await prismaCilient.product.count();
//     const orders = await prismaCilient.order.count();

//     return successResponse(
//       res,
//       { users, products, orders },
//       "Dashboard overview fetched successfully"
//     );
//   } catch (error) {
//     throw new NotFoundException(
//       "Dashboard overview not found",
//       ErrorCode.DASHBOARD_OVERVIEW_NOT_FOUND
//     );
//   }
// };
