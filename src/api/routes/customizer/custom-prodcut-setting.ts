import { Request, Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import CustomProductSettingsService from "../../../services/CustomProductSettings";

const router = Router();

export default function getCustomProductSettingsRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());


  router.get("/product/settings/layer", wrapHandler(async (req, res) => {
    const service: CustomProductSettingsService = req.scope.resolve('CustomProductSettingsService');

    const { layers } = await service.searchOne(req.query);
    res.status(200).json({
      status: 'success',
      layers,
    });
  }));

  router.get("/product/settings", wrapHandler(async (req, res) => {
    const service: CustomProductSettingsService = req.scope.resolve('CustomProductSettingsService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 50;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const custom_product_settings = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      custom_product_settings,
    });
  }));


  router.get('/product/settings/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomProductSettingsService = req.scope.resolve('CustomProductSettingsService');
    var custom_product_setting = await service.get({
      where: { id }
    });

    res.status(200).json({ custom_product_setting });
  }));

  // router.get("/product/settings", wrapHandler(async (req, res) => {
  //   const service: CustomProductSettingsService = req.scope.resolve('CustomProductSettingsService');
  //   const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Example: set the page size to 10 items per page
  //   const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1; // Example: get the page number from the request query parameter

  //   const custom_product_settings = await service.list();
  //   res.status(200).json({
  //     status: 'success',
  //     custom_product_settings,
  //   });
  // }));



  router.post("/product/settings", json(), wrapHandler(async (req, res) => {
    const {
      name,
      thai_name,
      material_group,
      preset_material,
      muay_thai,
      rank,
      product_id,
      customizer_area_id,
      name_id
    } = req.body;
    const service: CustomProductSettingsService = req.scope.resolve('CustomProductSettingsService');


    var stat = await service.create(name, thai_name, material_group, preset_material, muay_thai, product_id, name_id, customizer_area_id, rank);
    res.status(200).json({
      status: "success",
      stat,
    });
  }));

  router.put("/product/settings/:id", wrapHandler(async (req, res) => {
    const service: CustomProductSettingsService = req.scope.resolve('CustomProductSettingsService');
    const { id } = req.params;
    var result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({
        result
      });
    } else {
      res.status(201).json({
        status: 'id not found',
        result
      });
    }
  }));

  router.delete("/product/settings/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('CustomProductSettingsService');
    const result = await service.delete(id);
    const { affected } = result;
    res
      .status(200)
      .json({
        status: 'success',
        affected,
      });
  }));

  return router;
}
