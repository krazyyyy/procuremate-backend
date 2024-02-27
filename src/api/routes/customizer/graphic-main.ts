import { Request, Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import GraphicMainService from "services/graphic-main";

const router = Router();

export default function getGraphicMainRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/customizer/graphic-main/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: GraphicMainService = req.scope.resolve('graphicMainService');
    const graphic_main = await service.get({
      where: { id },
      relations: ['productCategories']
    });

    res.status(200).json({ graphic_main });
  }));

  router.get("/customizer/graphic-main", wrapHandler(async (req, res) => {
    const service: GraphicMainService = req.scope.resolve('graphicMainService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const graphic_main = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      graphic_main,
    });
  }));

  router.post("/customizer/graphic-main", json(), wrapHandler(async (req, res) => {
    const { name, type, product_categories } = req.body;
    const service: GraphicMainService = req.scope.resolve('graphicMainService');
    const newProduct = { name, type, product_categories };
    const stat = await service.create(newProduct);

    res.status(200).json({
      status: "success",
      stat,
    });
  }));

  router.put("/customizer/graphic-main/:id", wrapHandler(async (req, res) => {
    const service: GraphicMainService = req.scope.resolve('graphicMainService');
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

  router.delete("/customizer/graphic-main/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('graphicMainService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
