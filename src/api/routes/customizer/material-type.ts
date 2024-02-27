import { Router } from "express";
import { json } from "body-parser";
import { wrapHandler } from "@medusajs/medusa";
import MaterialTypeService from "../../../services/material-type";
import { MaterialType } from "../../../models/material-type";
import cors from "cors";

const router = Router();

export default function getMaterialTypesRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get("/customizer/material-types/:id", wrapHandler(async (req, res) => {
    const service: MaterialTypeService = req.scope.resolve('materialTypeService');
    const { id } = req.params;
    var material_type = await service.get({ where: { id } });
    res.status(200).json({ material_type });
  }));

  router.get("/customizer/material-types", wrapHandler(async (req, res) => {
    const service: MaterialTypeService = req.scope.resolve('materialTypeService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageSize
    delete req.query.pageNumber
    const queryParams = req.query;
  
    const material_types = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      material_types,
    });
  }));
  router.post("/customizer/material-types", json(), wrapHandler(async (req, res) => {
    const service: MaterialTypeService = req.scope.resolve('materialTypeService');
    const { title, description } = req.body;
    var mat: MaterialType = { title, description } as MaterialType;
    var result = await service.create(mat);
    res.status(201).json({
      result,
    });
  }));

  router.put("/customizer/material-types/:id", json(), wrapHandler(async (req, res) => {
    const service: MaterialTypeService = req.scope.resolve('materialTypeService');
    const { id } = req.params;
    var result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({
        result,
      });
    } else {
      res.status(404).json({
        status: 'id not found',
        result,
      });
    }
  }));

  router.delete("/customizer/material-types/:id", wrapHandler(async (req, res) => {
    const service: MaterialTypeService = req.scope.resolve('materialTypeService');
    const { id } = req.params;
    const { affected } = await service.delete(id);
    res.status(200).json({ affected });
  }));

  return router;
}
