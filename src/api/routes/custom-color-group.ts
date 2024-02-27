import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import authenticateFunc from '../auth';
import CustomColorGroupService from "../../services/custom-color-group";

const router = Router();

export default function getCustomColorGroupRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get("/store/custom-color-groups/:id", wrapHandler(async (req, res) => {
    const service: CustomColorGroupService = req.scope.resolve('customColorGroupService');
    const { id } = req.params;
    const custom_color_group = await service.get({ where: { id } });
    res.status(200).json({ custom_color_group });
  }));

  router.get("/store/custom-color-groups", wrapHandler(async (req, res) => {
    const service: CustomColorGroupService = req.scope.resolve('customColorGroupService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const custom_color_group = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      custom_color_group,
    });
  }));

  router.post("/store/custom-color-groups", authenticateFunc, json(), wrapHandler(async (req, res) => {
    const service: CustomColorGroupService = req.scope.resolve('customColorGroupService');
    const result = await service.create(req.body);
    res.status(201).json({ result });
  }));

  router.put("/store/custom-color-groups/:id", authenticateFunc, json(), wrapHandler(async (req, res) => {
    const service: CustomColorGroupService = req.scope.resolve('customColorGroupService');
    const { id } = req.params;
    const result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({ result });
    } else {
      res.status(201).json({
        status: 'id not found',
        result
      });
    }
  }));

  router.delete("/store/custom-color-groups/:id", authenticateFunc, wrapHandler(async (req, res) => {
    const service: CustomColorGroupService = req.scope.resolve('customColorGroupService');
    const { id } = req.params;
    const { affected } = await service.delete(id);
    res.status(200).json({ affected });
  }));

  return router;
}
