import { Router } from "express";
import { json } from 'body-parser';
import authenticateFunc from '../auth';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();
export default function getGraphicSizeRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/store/graphic-sizes', wrapHandler(async (req, res) => {
    const graphicsizesService = req.scope.resolve('graphicsizesService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const graphic_size = await graphicsizesService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      graphic_size,
    });
  }));

  router.delete('/store/graphic-sizes', json(), wrapHandler(async (req, res) => {
    const graphicsizesService = req.scope.resolve('graphicsizesService');
    const { id } = req.body;
    const result = await graphicsizesService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/store/graphic-sizes", json(), wrapHandler(async (req, res) => {
    const graphicsizesService = req.scope.resolve('graphicsizesService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const { title, description, price, graphic_id } = req.body;

    if (!title) {
      res.json({
        status: 'error',
        message: 'title is mandatory',
      });
      return;
    }

    const graphicSize = await graphicsizesService.create(title, description, price, graphic_id);

    res.json({
      status: 'success',
      message: "Graphic size created",
      id: graphicSize.id,
    });
  }));

  router.put("/store/graphic-sizes/:id", json(), wrapHandler(async (req, res) => {
    const graphicsizesService = req.scope.resolve('graphicsizesService');
    const { id } = req.params;
    const { title, description, price, graphic_id } = req.body;

    if (!title) {
      res.json({
        status: 'error',
        message: 'title is mandatory',
      });
      return;
    }

    const graphicSize = await graphicsizesService.update(id, { title, description, price, graphic_id });

    res.json({
      status: 'success',
      message: "Graphic size updated",
      graphicSize,
    });
  }));

  router.get('/store/graphic-sizes/:id', wrapHandler(async (req, res) => {
    const graphicsizesService = req.scope.resolve('graphicsizesService');
    const { id } = req.params;

    const graphicSize = await graphicsizesService.findById(id);

    if (!graphicSize) {
      res.json({
        status: 'error',
        message: 'Graphic size not found',
      });
      return;
    }

    res.json({
      status: 'success',
      graphicSize,
    });
  }));

  return router;
}
