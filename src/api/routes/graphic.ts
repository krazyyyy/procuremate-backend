import { Router } from "express";
import { json } from 'body-parser';
import authenticateFunc from '../auth';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();

export default function getGraphicRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/store/graphic', wrapHandler(async (req, res) => {
    const graphicService = req.scope.resolve('graphicsService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const graphics = await graphicService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      graphics,
    });
  }));

  router.delete('/store/graphic', wrapHandler(async (req, res) => {
    const graphicService = req.scope.resolve('graphicsService');
    const { id } = req.body;
    const result = await graphicService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/store/graphic", wrapHandler(async (req, res) => {
    const graphicService = req.scope.resolve('graphicsService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const { name, type, image_url } = req.body;

    if (!name) {
      res.json({
        status: 'error',
        message: 'name is mandatory',
      });
      return;
    }

    const graphic = await graphicService.create(name, type, image_url);
    res.json({
      status: 'success',
      message: "Graphic created",
      id: graphic.id,
    });
  }));

  router.put("/store/graphic/:id", wrapHandler(async (req, res) => {
    const graphicService = req.scope.resolve('graphicsService');
    const { id } = req.params;
    const { name, type } = req.body;

    if (!name) {
      res.json({
        status: 'error',
        message: 'name is mandatory',
      });
      return;
    }

    const graphic = await graphicService.update(id, { name, type });
    res.json({
      status: 'success',
      message: "Graphic updated",
      graphic,
    });
  }));

  router.get('/store/graphic/:id', wrapHandler(async (req, res) => {
    const graphicService = req.scope.resolve('graphicsService');
    const { id } = req.params;

    const graphic = await graphicService.findById(id);

    if (!graphic) {
      res.json({
        status: 'error',
        message: 'Graphic not found',
      });
      return;
    }

    res.json({
      status: 'success',
      graphic,
    });
  }));
  router.delete('/store/graphic/:id', wrapHandler(async (req, res) => {
    const graphicService = req.scope.resolve('graphicsService');
    const { id } = req.params;

    const result = await graphicService.delete(id);

    if (!result) {
      res.json({
        status: 'error',
        message: 'Graphic not found',
      });
      return;
    }

    res.json({
      status: 'success',
      result,
    });
  }));

  return router;
}
