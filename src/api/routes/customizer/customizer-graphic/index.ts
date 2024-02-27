import { Request, Router } from "express"
import { json } from 'body-parser'
import CustomizerGraphicService from "../../../../services/customizer-graphic";
import { CustomizerGraphic } from "../../../../models/customizer-graphic";
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
const router = Router()

export default function getCustomizerGraphicRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());
  router.get('/customizer/graphics/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');
    var graphics = await service.get({
      where: { id }
    })

    res.status(200).json({ graphics })
  }))

  router.get("/customizer/graphics", wrapHandler(async (req, res) => {
    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');

    var graphics = await service.list();
    res.status(200).json({
      status: 'success',
      graphics,
    })
  }));


  router.post("/customizer/graphics", json(), wrapHandler(async (req, res) => {
    const { flag_price, graphic_price, upload_price, muay_thai, remove_boxer_logo } = req.body

    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');
    if (!flag_price) {
      res.status(400).send("flag_price is required")
      return;
    }
    var stat = await service.create({ flag_price, graphic_price, upload_price, muay_thai, remove_boxer_logo } as CustomizerGraphic)
    res.status(200).json({
      status: "success",
      stat,
    })
  }));

  router.put("/customizer/graphics/:id", json(), (async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');
    var result = await service.update(id, fields)
    if (result) {
      res.status(200).json({ status: 'success', result })
    } else
      res.status(400).json({
        status: 'id not found',
        success: result
      })

  }));

  router.delete("/customizer/graphics/:id", wrapHandler(async (req, res) => {

    const { id } = req.params;
    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');
    const result = await service.delete(id);
    const { affected } = result;
    res
      .status(200)
      .json({
        status: 'success',
        affected,
      })

  }));

  return router;
}