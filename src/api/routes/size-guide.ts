import { Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import SizeGuideValuesService from "../../services/size-value";
import SizeGuideService from "../../services/size-guide";

const router = Router();

export default function getSizeGuideRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/store/size-guide', wrapHandler(async (req, res) => {
    const service: SizeGuideValuesService = req.scope.resolve('sizeValueService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const size_guide = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      size_guide,
    });
  }));

  router.get('/store/size-guide/new', wrapHandler(async (req, res) => {
    const service: SizeGuideService = req.scope.resolve('sizeGuideService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const size_guide = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      size_guide,
    });
  }));



  router.delete('/store/size-guide/:id', json(), wrapHandler(async (req, res) => {
    const service: SizeGuideValuesService = req.scope.resolve('sizeValueService');
    const { id } = req.params;
    const result = await service.delete(id);
    const affected = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  router.post("/store/size-guide", json(), wrapHandler(async (req, res) => {
    const service: SizeGuideValuesService = req.scope.resolve('sizeValueService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const { column_one, column_two, column_three, column_four, type, category_id } = req.body;


    const sizeGuide = await service.create({ column_one, column_two, column_three, column_four, type, category_id });


    res.json({
      status: 'success',
      message: "size created",
      id: sizeGuide.id,
    });
  }));


  router.put("/store/size-guide/:id", wrapHandler(async (req, res) => {
    const service: SizeGuideValuesService = req.scope.resolve('sizeValueService');
    const { id } = req.params;
    const { column_one, column_two, column_three, column_four, type, category_id } = req.body;

    const size_guide = await service.update(id, { column_one, column_two, column_three, column_four, type, category_id });

    res.json({
      status: 'success',
      message: "Graphic size updated",
      size_guide,
    });
  }));

  router.get('/store/size-guide/:id', wrapHandler(async (req, res) => {
    const service: SizeGuideValuesService = req.scope.resolve('sizeValueService');
    const { id } = req.params;

    const size_guide = await service.get({ where: { id }, relations: ['category_id'] });

    if (!size_guide) {
      res.json({
        status: 'error',
        message: 'Graphic size not found',
      });
      return;
    }

    res.json({
      status: 'success',
      size_guide,
    });
  }));

  return router;
}
