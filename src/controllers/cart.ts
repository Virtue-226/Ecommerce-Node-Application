import { Request, Response } from "express";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaCilient } from "..";
import { successResponse } from "../Responses/successresponse";
import { BadRequestException } from "../exceptions/badRequest";
import { CreateCartSchema, changeQuantitySchema } from "../schema/cart";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product; // Product is a type from prisma

  try {
    product = await prismaCilient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException("Item not found", ErrorCode.PRODUCT_NOT_FOUND);
  }

  const cart = await prismaCilient.cart.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.quantity,
    },
  });

  return successResponse(res, cart, "Item added to cart successfully");
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const cartId = req.params.id;
  const cart = await prismaCilient.cart.findFirst({
    where: {
      id: Number(cartId),
    },
  });

  if (!cart) {
    throw new NotFoundException(
      "Item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cart.userId !== req.user.id) {
    throw new BadRequestException(
      "You are not authorized to delete this item",
      ErrorCode.UNAUTHORIZED
    );
  }

  await prismaCilient.cart.delete({
    where: {
      id: Number(cartId),
    },
  });

  return successResponse(res, null, "Item deleted successfully");
};

export const changeQuantity = async (req: Request, res: Response) => {
  const cartId = req.params.id;
  console.log(cartId);
  const validatedData = changeQuantitySchema.parse(req.body);
  const cart = await prismaCilient.cart.findFirst({
    where: {
      id: Number(cartId),
    },
  });

  if (!cart) {
    throw new NotFoundException(
      "Item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cart.userId !== req.user.id) {
    throw new BadRequestException(
      "You are not authorized to change the quantity of this item",
      ErrorCode.UNAUTHORIZED
    );
  }

  await prismaCilient.cart.update({
    where: {
      id: Number(cartId),
    },
    data: {
      quantity: validatedData.quantity,
    },
  });

  return successResponse(res, null, "Quantity updated successfully");
};

export const listCartItems = async (req: Request, res: Response) => {
  const loggedInUser = req.user;
  const cart = await prismaCilient.cart.findMany({
    where: {
      userId: loggedInUser.id,
    },
    include: {
      product: true,
    },
  });

  return successResponse(res, cart, "Cart items fetched successfully");
};

export const getCartSingleById = async (req: Request, res: Response) => {
  const loggedInUser = req.user;
  const cartId = req.params.id;

  const cart = await prismaCilient.cart.findFirst({
    where: {
      id: Number(cartId),
    },
    include: {
      product: true,
    },
  });

  if (!cart) {
    throw new NotFoundException(
      "Item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cart.userId !== loggedInUser.id) {
    throw new BadRequestException(
      "You are not authorized to view this item",
      ErrorCode.UNAUTHORIZED
    );
  }

  return successResponse(res, cart, "Cart item fetched successfully");
};
