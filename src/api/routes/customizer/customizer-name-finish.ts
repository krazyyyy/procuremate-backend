import { Request, Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

import { CustomizerNameFinishes } from "../../../models/customizer-name-finishes";
const router = Router();

export default function getCustomizerNameFinishRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/customizer/name-finishes/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service= req.scope.resolve('customizerNameFinishService');
    const name_finishes = await service.get({ where: { id } });

    res.status(200).json({ name_finishes });
  }));

  router.get("/customizer/name-finishes", wrapHandler(async (req, res) => {
    const service = req.scope.resolve('customizerNameFinishService');
    const name_finishes = await service.list();
    
    res.status(200).json({ name_finishes });
  }));

  router.post("/customizer/name-finishes",  json(), wrapHandler(async (req, res) => {
    const { title, price, is_three_d } = req.body;
    const service= req.scope.resolve('customizerNameFinishService');
    var ca = {
      title,
      price,
      is_three_d,
    };

    const stat = await service.create(ca as CustomizerNameFinishes);
    res.status(200).json({ stat });
  }));

  router.put("/customizer/name-finishes/:id",  json(), wrapHandler(async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const service= req.scope.resolve('customizerNameFinishService');
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

  router.delete("/customizer/name-finishes/:id",  wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service= req.scope.resolve('customizerNameFinishService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
