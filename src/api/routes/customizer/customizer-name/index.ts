import { Request, Router, query } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import CustomizerNameService from "../../../../services/customizer-name";
import { CustomizerName } from "../../../../models/customizer-name";

const router = Router();

export function getCustomizerNameRouter(corsOptions): Router {
  router.use(cors(corsOptions), json());

  router.get('/customizer/names/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomizerNameService = req.scope.resolve('customizerNameService');
    const name = await service.get({
      where: { id }
    });
    res.status(200).json({ name });
  }));

  router.get("/customizer/names", wrapHandler(async (req, res) => {
    const service: CustomizerNameService = req.scope.resolve('customizerNameService');
    const finishService = req.scope.resolve('customizerNameFinishService');

    const { product_category_id } = req.query as any;
    let names = [];
    if (product_category_id) {
      names = await service.get({
        where: {
          product_types: {
            id: product_category_id,
          }
        }
      })
    } else
      names = await service.list();

    var finishes = await finishService.list()

    for (var index in names) {
      names[index].finishes = finishes
    }
    res.status(200).json({
      status: 'success',
      names,
    });
  }));

  router.post("/customizer/names", wrapHandler(async (req, res) => {
    try {
      const service: CustomizerNameService = req.scope.resolve('customizerNameService');
      const stat = await service.create(req.body);
      res.status(200).json({
        status: "success",
        stat,
      });
    } catch (error) {
      res.status(400).send("invalid data");
    }
  }));

  router.put("/customizer/names/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const service: CustomizerNameService = req.scope.resolve('customizerNameService');
    const result = await service.update(id, fields);
    if (result) {
      res.status(200).json({ status: 'success', result });
    } else {
      res.status(400).json({
        status: 'id not found',
        success: result,
      });
    }
  }));

  router.delete("/customizer/names/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: CustomizerNameService = req.scope.resolve('customizerNameService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
