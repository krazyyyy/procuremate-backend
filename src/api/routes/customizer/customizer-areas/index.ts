import { Request, Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import authenticateFunc from '../../../auth';
import CustomizerAreaService from "../../../../services/customizer-area";
import { CustomizerArea } from "../../../../models/customizer-area";

const router = Router();

export default function getCustomizerAreasRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/customizer/areas/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomizerAreaService = req.scope.resolve('customizerAreaService');
    const areas = await service.get({ where: { id } });

    res.status(200).json({ areas });
  }));

  router.get("/customizer/areas", wrapHandler(async (req, res) => {
    const service: CustomizerAreaService = req.scope.resolve('customizerAreaService');
    const areas = await service.list();
    
    res.status(200).json({ areas });
  }));

  router.post("/customizer/areas", authenticateFunc, json(), wrapHandler(async (req, res) => {
    const { title, price_adjust, optional } = req.body;
    const service: CustomizerAreaService = req.scope.resolve('customizerAreaService');
    var ca = {
      title,
      price_adjust,
      optional,
    };

    const stat = await service.create(ca as CustomizerArea);
    res.status(200).json({ stat });
  }));

  router.put("/customizer/areas/:id", authenticateFunc, json(), wrapHandler(async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const service: CustomizerAreaService = req.scope.resolve('customizerAreaService');
    const result = await service.update(id, fields);
    
    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(400).json({
        status: 'id not found',
        success: result
      });
    }
  }));

  router.delete("/customizer/areas/:id", authenticateFunc, wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: CustomizerAreaService = req.scope.resolve('customizerAreaService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
