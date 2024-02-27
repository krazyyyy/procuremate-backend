import { Request, Router } from "express"
import CustomSettingsService from "../../../../services/custom-settings";

const router = Router()

export default function getCustomizerSettings(): Router {
  router.get('/customizer/settings/:id', async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomSettingsService = req.scope.resolve('customSettingsService');
    // var areas = await service.get({
    //   where: { id }
    // })

    res.status(200).json({ success: 'true' })
  })

  router.get("/customizer/settings", async (req, res) => {
    const service: CustomSettingsService = req.scope.resolve('customSettingsService');

    var data = await service.list();
    res.status(200).json({
      status: 'success',
      data,
    })
  });


  // router.post("/customizer/settings", json(), async (req, res) => {
  //   const { title, price_adjust, optional } = req.body

  //   const service: CustomSettingsService = req.scope.resolve('customSettingsService');
  //   var ca = {
  //     title,
  //     price_adjust,
  //     optional,
  //   }

  //   var stat = await service.create(ca as CustomizerArea)
  //   res.status(200).json({
  //     status: "success",
  //     stat,
  //   })
  // });

  // router.put("/customizer/settings/:id", json(), async (req, res) => {
  //   const { id } = req.params;
  //   const fields = req.body;
  //   const service: CustomSettingsService = req.scope.resolve('customSettingsService');
  //   var result = await service.update(id, fields)
  //   if (result) {
  //     res.status(200).json({ status: 'success', result })
  //   } else
  //     res.status(400).json({
  //       status: 'id not found',
  //       success: result
  //     })

  // });

  // router.delete("/customizer/settings/:id", async (req, res) => {

  //   const { id } = req.params;
  //   const service: CustomSettingsService = req.scope.resolve('customSettingsService');
  //   const result = await service.delete(id);
  //   const { affected } = result;
  //   res
  //     .status(200)
  //     .json({
  //       status: 'success',
  //       affected,
  //     })

  // });

  return router;
}