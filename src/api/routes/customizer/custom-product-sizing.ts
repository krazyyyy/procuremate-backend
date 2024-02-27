import { Request, Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import CustomProductSizingService from "../../../services/custom-product-sizing";

const router = Router();

export default function getCustomProductSizingRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/customizer/sizes/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomProductSizingService = req.scope.resolve('customProductSizingService');
    var custom_product_sizing = await service.get({
      where: { id }
    });

    res.status(200).json({ custom_product_sizing });
  }));

  router.get("/customizer/sizes", wrapHandler(async (req, res) => {
    const service: CustomProductSizingService = req.scope.resolve('customProductSizingService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;
    const custom_product_sizings = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      custom_product_sizings,
    });
  }));



  router.post("/customizer/sizes", json(), wrapHandler(async (req, res) => {
    const {
      title,
      price_adjust,
      custom_sizes_id
    } = req.body;

    const service: CustomProductSizingService = req.scope.resolve('customProductSizingService');
    var newProduct = { title, price_adjust, custom_sizes_id };
    var stat = await service.create(newProduct);
    res.status(200).json({
      status: "success",
      stat,
    });
  }));

  router.put("/customizer/sizes/:id", wrapHandler(async (req, res) => {
    const service: CustomProductSizingService = req.scope.resolve('customProductSizingService');
    const { id } = req.params;
    var result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({
        result
      });
    } else {
      res.status(400).json({
        status: 'id not found',
        result
      });
    }
  }));

  router.delete("/customizer/sizes/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('customProductSizingService');
    const result = await service.delete(id);
    const { affected } = result;
    res
      .status(200)
      .json({
        status: 'success',
        affected,
      });
  }));

  return router;
}
