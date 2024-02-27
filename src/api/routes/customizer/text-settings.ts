import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import authenticateFunc from '../../auth';
import TextSettingsService from "../../../services/text-settings";

const router = Router();

export default function getTextSettingsRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get("/customizer/text-settings/:id", wrapHandler(async (req, res) => {
    const service: TextSettingsService = req.scope.resolve('textSettingsService');
    const { id } = req.params;
    const setting = await service.get({ where: { id } });
    res.status(200).json({ setting });
  }));

  router.get("/customizer/text-settings", wrapHandler(async (req, res) => {
    const service: TextSettingsService = req.scope.resolve('textSettingsService');
    const settings = await service.list();
    res.status(200).json({ settings });
  }));

  router.post("/customizer/text-settings", authenticateFunc, json(), wrapHandler(async (req, res) => {
    const service: TextSettingsService = req.scope.resolve('textSettingsService');
    const result = await service.create(req.body);
    res.status(201).json({ result });
  }));

  router.put("/customizer/text-settings/:id", authenticateFunc, json(), wrapHandler(async (req, res) => {
    const service: TextSettingsService = req.scope.resolve('textSettingsService');
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

  router.delete("/customizer/text-settings/:id", authenticateFunc, wrapHandler(async (req, res) => {
    const service: TextSettingsService = req.scope.resolve('textSettingsService');
    const { id } = req.params;
    const { affected } = await service.delete(id);
    res.status(200).json({ affected });
  }));

  return router;
}
