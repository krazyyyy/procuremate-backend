import { Request, Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import CustomStyleOptionsService from "../../../services/custom-style-option";
const router = Router();

export default function getCustomStyleOption(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/customizer/style_option/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomStyleOptionsService = req.scope.resolve('customStyleOptionService');
    const custom_product_sizing = await service.get({
      where: { id },
      relations: ['productCategories'] 
    });

    res.status(200).json({ custom_product_sizing });
  }));

  router.get("/customizer/style_option", wrapHandler(async (req, res) => {
    const service: CustomStyleOptionsService = req.scope.resolve('customStyleOptionService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const custom_style_options = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      custom_style_options,
    });
  }));

  router.post("/customizer/style_option", json(), wrapHandler(async (req, res) => {
    const { title, subtitle, price, image_url, custom_style_id } = req.body;
    const service: CustomStyleOptionsService = req.scope.resolve('customStyleOptionService');
    const stat = await service.create(title, subtitle, price, image_url, custom_style_id);
    
    res.status(200).json({
      status: "success",
      stat,
    });
  }));

  router.put("/customizer/style_option/:id", wrapHandler(async (req, res) => {
    const service: CustomStyleOptionsService = req.scope.resolve('customStyleOptionService');
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

  router.delete("/customizer/style_option/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('customStyleOptionService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
