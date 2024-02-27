import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();
export default function getProductionTypeRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/store/production-type', wrapHandler(async (req, res) => {
    const productionTypeService = req.scope.resolve('productionTypeService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const production_type = await productionTypeService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      production_type,
    });
  }));

  router.delete('/store/production-type',  json(), wrapHandler(async (req, res) => {
    const productionTypeService = req.scope.resolve('productionTypeService');
    const { id } = req.body;
    const result = await productionTypeService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/store/production-type",  json(), wrapHandler(async (req, res) => {
    const productionTypeService = req.scope.resolve('productionTypeService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }

    const production_type = await productionTypeService.create(req.body);

    res.json({
      status: 'success',
      message: "Production Type size created",
      id: production_type.id,
    });
  }));

  router.put("/store/production-type/:id",  json(), wrapHandler(async (req, res) => {
    const productionTypeService = req.scope.resolve('productionTypeService');
    const { id } = req.params;

    const production_type = await productionTypeService.update(id, req.body);

    res.json({
      status: 'success',
      message: "Production Type size updated",
      production_type,
    });
  }));

  router.get('/store/production-type/:id',  wrapHandler(async (req, res) => {
    const productionTypeService = req.scope.resolve('productionTypeService');
    const { id } = req.params;

    const production_type = await productionTypeService.findById(id);

    if (!production_type) {
      res.json({
        status: 'error',
        message: 'Production Type size not found',
      });
      return;
    }

    res.json({
      status: 'success',
      production_type,
    });
  }));

  return router;
}
