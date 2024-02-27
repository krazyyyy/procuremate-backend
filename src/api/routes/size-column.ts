import { Router } from "express";
import { json } from 'body-parser';
import authenticateFunc from '../auth';
import cors from "cors";
import { wrapHandler } from '@medusajs/medusa';
import SizeColumnValuesService from "../../services/size-column";

const router = Router();

export default function getSizeColumnRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/store/size-columns', wrapHandler(async (req, res) => {
    const service: SizeColumnValuesService = req.scope.resolve('sizeColumnService');
    const pageSize = parseInt(req.query.pageSize as string, 100) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const size_value = await service.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      size_value,
    });
  }));


  router.delete('/store/size-columns', json(), wrapHandler(async (req, res) => {
    const service = req.scope.resolve('sizeColumnService');
    const { id } = req.body;
    const { status, error } = await service.delete(id);

    if (status === 'success') {
      res.status(201).json({
        status: 'success',
        message: 'Size Column deleted successfully',
      });
    } else {
      res.status(500).json({
        status: 'error',
        error: error,
      });
    }
  }));

  router.post("/store/size-columns", json(), wrapHandler(async (req, res) => {
    const service: SizeColumnValuesService = req.scope.resolve('sizeColumnService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const { column_one, column_two, column_three, column_four, size_key } = req.body;


    const data = await service.create({ column_one, column_two, column_three, column_four, size_key });

    res.json({
      status: 'success',
      message: "Size Column created",
      id: data.id,
    });

  }));

  router.put("/store/size-columns/:id", wrapHandler(async (req, res) => {
    const service = req.scope.resolve('sizeColumnService');
    const { id } = req.params;
    const { column_one, column_two, column_three, column_four } = req.body;


    const { status, sizeColumn, error } = await service.update(id, { column_one, column_two, column_three, column_four });

    if (status === 'success') {
      res.json({
        status: 'success',
        message: "Size Column updated",
        sizeColumn,
      });
    } else {
      res.status(500).json({
        status: 'error',
        error: error,
      });
    }
  }));

  router.get('/store/size-columns/:id', wrapHandler(async (req, res) => {
    const service = req.scope.resolve('sizeColumnService');
    const { id } = req.params;

    const size_value = await service.get(id);

    if (!size_value) {
      res.json({
        status: 'error',
        message: 'Graphic size not found',
      });
      return;
    }

    res.json({
      status: 'success',
      size_value,
    });
  }));

  return router;
}
