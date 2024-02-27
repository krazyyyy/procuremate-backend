import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import CustomMaterialService from "../../../services/custom-material";
import cors from "cors";
import CustomColorGroupService from "../../../services/custom-color-group";

const router = Router();

export default function getCustomMaterialRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json())
  router.get("/customizer/custom-materials/:id", wrapHandler(async (req, res) => {
    const service: CustomMaterialService = req.scope.resolve('customMaterialService');
    const { id } = req.params;
    const custom_material = await service.get({ where: { id } });
    res.status(200).json({ custom_material });
  }));


  router.post("/customizer/custom-materials/all", json(), wrapHandler(async (req, res) => {
    const colorService: CustomColorGroupService = req.scope.resolve('customizerColorGroupService');
    const service: CustomMaterialService = req.scope.resolve('customMaterialService');
    const { layers } = req.body;
    const exclude = ['image', 'text', 'font', 'production', 'flag', 'size', 'fight', 'graphic'];
    const data: any = {};

    for (const layer of layers) {
      if (exclude.includes(layer.id)) continue;

      const type = await colorService.get({ where: { id: layer.material_group?.id } });
      const materialTypes = type[0].materialTypes;

      await Promise.all(materialTypes.map(async (materialType) => {
        const mat = await service.get({ where: { material_type: materialType.id } });
        materialType.materials = mat;
      }));

      data[layer.id] = materialTypes;
    }

    console.log("DATA", Object.keys(data).length > 0)

    res.status(200).json(data);
  }));


  router.get("/customizer/custom-materials", wrapHandler(async (req, res) => {
    const service: CustomMaterialService = req.scope.resolve('customMaterialService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageSize
    delete req.query.pageNumber
    const queryParams = req.query;

    const custom_material = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      custom_material,
    });
  }));

  router.post("/customizer/custom-materials", json(), wrapHandler(async (req, res) => {
    const service: CustomMaterialService = req.scope.resolve('customMaterialService');
    const result = await service.create(req.body);
    res.status(201).json({ result });
  }));

  router.put("/customizer/custom-materials/:id", json(), wrapHandler(async (req, res) => {
    const service: CustomMaterialService = req.scope.resolve('customMaterialService');
    const { id } = req.params;
    const result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({ result });
    } else {
      res.status(201).json({ status: 'id not found', result });
    }
  }));

  router.delete("/customizer/custom-materials/:id", wrapHandler(async (req, res) => {
    const service: CustomMaterialService = req.scope.resolve('customMaterialService');
    const { id } = req.params;
    const { affected } = await service.delete(id);
    res.status(200).json({ affected });
  }));

  return router;
}
