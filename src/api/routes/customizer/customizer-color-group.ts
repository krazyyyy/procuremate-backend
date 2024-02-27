import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import CustomizerColorGroupService from "../../../services/customizer-color-group";
import cors from "cors";
const router = Router();

export default function getCustomizerColorGroupRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json())
  router.get("/customizer/color-groups/:id", wrapHandler(async (req, res) => {
    const service: CustomizerColorGroupService = req.scope.resolve('customizerColorGroupService');
    const { id } = req.params;
    const color_group = await service.get({ where: { id } });
    res.status(200).json({ color_group });
  }));

  router.get("/customizer/color-groups", wrapHandler(async (req, res) => {
    const service: CustomizerColorGroupService = req.scope.resolve('customizerColorGroupService');
    const color_groups = await service.list();
    res.status(200).json({ color_groups });
  }));

  router.post("/customizer/color-groups", json(), wrapHandler(async (req, res) => {
    const service: CustomizerColorGroupService = req.scope.resolve('customizerColorGroupService');
    const result = await service.create(req.body);
    res.status(201).json({ result });
  }));

  router.put("/customizer/color-groups/:id", json(), wrapHandler(async (req, res) => {
    const service: CustomizerColorGroupService = req.scope.resolve('customizerColorGroupService');
    const { id } = req.params;
    const result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({ result });
    } else {
      res.status(201).json({ status: 'id not found', result });
    }
  }));

  router.delete("/customizer/color-groups/:id", wrapHandler(async (req, res) => {
    const service: CustomizerColorGroupService = req.scope.resolve('customizerColorGroupService');
    const { id } = req.params;
    const { affected } = await service.delete(id);
    res.status(200).json({ affected });
  }));

  return router;
}
