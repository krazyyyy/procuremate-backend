import { Request, Router } from "express";
import { json } from "body-parser";
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import CustomProductStyleService from "../../../services/custom-product-style";

const router = Router();

export default function getCustomProductStyleRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/customizer/styles/:id', wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: CustomProductStyleService = req.scope.resolve('customProductStyleService');
    var style = await service.get({
      where: { id },
    });

    res.status(200).json({ style });
  }));

  router.get("/customizer/styles", wrapHandler(async (req, res) => {
    const service: CustomProductStyleService = req.scope.resolve('customProductStyleService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const custom_style = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      custom_style,
    });
  }));

  router.post("/customizer/styles", json(), wrapHandler(async (req, res) => {
    const service: CustomProductStyleService = req.scope.resolve('customProductStyleService');
    var stat = await service.create(req.body);
    res.status(200).json({
      status: "success",
      stat,
    });
  }));

  router.put("/customizer/styles/:id", json(), wrapHandler(async (req, res) => {
    const service: CustomProductStyleService = req.scope.resolve('customProductStyleService');
    const { id } = req.params;
    var result = await service.update(id, req.body);
    if (result) {
      res.status(200).json({
        result,
      });
    } else {
      res.status(404).send("not found");
    }
  }));

  router.delete("/customizer/styles/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('customProductStyleService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
