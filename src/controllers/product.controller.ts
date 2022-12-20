import { Request, Response } from "express";
import {
  CreateProductInput,
  DeleteProductInput,
  ReadProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../services/product.service";

export const createProducthandler = async (
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const { body } = req;

  const product = await createProduct({ ...body, user: userId });

  res.send(product);
};

export const updateProductHandler = async (
  req: Request<UpdateProductInput["params"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const { productId } = req.params;
  const update = req.body;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });

  return res.send(updatedProduct);
};

export const getProducthandler = async (
  req: Request<ReadProductInput["params"]>,
  res: Response
) => {
  const { productId } = req.params;
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
};

export const deleteProducthandler = async (
  req: Request<DeleteProductInput["params"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const { productId } = req.params;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteProduct({ productId });

  return res.sendStatus(200);
};
