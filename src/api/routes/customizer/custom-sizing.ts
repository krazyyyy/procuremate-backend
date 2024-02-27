import { Request, Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import CustomSizingService from "../../../services/custom-sizing";

const router = Router();

export default function getCustomSizingRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/customizer/sizes_list/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomSizingService = req.scope.resolve('customSizingService');
    const custom_product_sizing = await service.get({
      where: { id },
      relations: ['productCategories']
    });

    res.status(200).json({ custom_product_sizing });
  }));

  router.get("/customizer/sizes_list", wrapHandler(async (req, res) => {
    const service: CustomSizingService = req.scope.resolve('customSizingService');
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

  router.post("/customizer/sizes_list", json(), wrapHandler(async (req, res) => {
    const { title, product_categories } = req.body;
    const service: CustomSizingService = req.scope.resolve('customSizingService');
    const newProduct = { title, product_categories };
    const stat = await service.create(newProduct);

    res.status(200).json({
      status: "success",
      stat,
    });
  }));

  router.put("/customizer/sizes_list/:id", wrapHandler(async (req, res) => {
    const service: CustomSizingService = req.scope.resolve('customSizingService');
    const { id } = req.params;
    const result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({
        result
      });
    } else {
      res.status(201).json({
        status: 'id not found',
        result
      });
    }
  }));

  router.delete("/customizer/sizes_list/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('customSizingService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
