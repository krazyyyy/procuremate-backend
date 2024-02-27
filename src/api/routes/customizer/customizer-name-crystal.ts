import { Request, Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

import CustomizerNameCrystalService from "../../../services/customizer-name-crystal";
import {CustomizerNameCrystal} from "../../../models/customizer-name-crystals";
const router = Router();

export default function getCustomizerNameCrystalRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/customizer/name-crystal/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomizerNameCrystalService = req.scope.resolve('customizerNameCrystalService');
    const name_crystal = await service.get({ where: { id } });

    res.status(200).json({ name_crystal });
  }));

  router.get("/customizer/name-crystal", wrapHandler(async (req, res) => {
    const service: CustomizerNameCrystalService = req.scope.resolve('customizerNameCrystalService');
    const name_crystal = await service.list();
    
    res.status(200).json({ name_crystal });
  }));

  router.post("/customizer/name-crystal",  json(), wrapHandler(async (req, res) => {
    const { description, price, material_type } = req.body;
    const service: CustomizerNameCrystalService = req.scope.resolve('customizerNameCrystalService');
    var ca = {
      material_type,
      price,
      description,
    };

    const stat = await service.create(ca as CustomizerNameCrystal);
    res.status(200).json({ stat });
  }));

  router.put("/customizer/name-crystal/:id",  json(), wrapHandler(async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const service: CustomizerNameCrystalService = req.scope.resolve('customizerNameCrystalService');
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

  router.delete("/customizer/name-crystal/:id",  wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: CustomizerNameCrystalService = req.scope.resolve('customizerNameCrystalService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
