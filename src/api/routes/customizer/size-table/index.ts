import { Request, Router } from "express"
import { json } from 'body-parser'
import CustomizerGraphicService from "../../../../services/customizer-graphic";
import { CustomizerGraphic } from "../../../../models/customizer-graphic";

const router = Router()

export default function getSizeTableRouter(): Router {

  router.get('/customizer/size-tables/:id', async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');
    var size_table = await service.get({
      where: { id }
    })

    res.status(200).json({ size_table })
  })

  router.get("/customizer/size-tables", async (req, res) => {
    const service: CustomizerGraphicService = req.scope.resolve('customizerGraphicService');

    var size_tables = await service.list();
    res.status(200).json({
      status: 'success',
      size_tables,
    })
  });


  router.post("/customizer/size-tables", json(), async (req, res) => {
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
  });

  router.put("/customizer/size-tables/:id", json(), async (req, res) => {
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

  });

  router.delete("/customizer/size-tables/:id", async (req, res) => {

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

  });

  return router;
}