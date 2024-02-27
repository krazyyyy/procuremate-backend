import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();

export default function getProductionRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/store/production', wrapHandler(async (req, res) => {
    const productionService = req.scope.resolve('productionService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const production = await productionService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      production,
    });
  }));

  router.delete('/store/production',  wrapHandler(async (req, res) => {
    const productionService = req.scope.resolve('productionService');
    const { id } = req.body;
    const result = await productionService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/store/production",  wrapHandler(async (req, res) => {
    const productionService = req.scope.resolve('productionService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }


    const production = await productionService.create(req.body);
    res.json({
      status: 'success',
      message: "Production created",
      id: production.id,
    });
  }));

  router.put("/store/production/:id",  wrapHandler(async (req, res) => {
    const productionService = req.scope.resolve('productionService');
    const { id } = req.params;

    const production = await productionService.update(id, req.body);
    res.json({
      status: 'success',
      message: "Production updated",
      production,
    });
  }));

  router.get('/store/production/:id',  wrapHandler(async (req, res) => {
    const productionService = req.scope.resolve('productionService');
    const { id } = req.params;

    const production = await productionService.findById(id);

    if (!production) {
      res.json({
        status: 'error',
        message: 'Production not found',
      });
      return;
    }

    res.json({
      status: 'success',
      production,
    });
  }));

  return router;
}
