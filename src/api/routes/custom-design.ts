import { Request, Router } from "express";
import { json } from 'body-parser';
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import CustomDesignService from "services/custom-design";
import { compress, decompress } from 'lz-string'

const router = Router();

export default function getCustomDesignRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/customizer/design/:id', wrapHandler(async (req: Request, res) => {
    const { id } = req.params;
    const service: CustomDesignService = req.scope.resolve('customDesignService');
    const custom_design = await service.get({
      where: { id: id },
      relations: ['product_id', "customer_id"]
    });
    res.status(200).json({ custom_design });
  }));

  router.get("/customizer/design", wrapHandler(async (req, res) => {
    const service: CustomDesignService = req.scope.resolve('customDesignService');
    const pageSize = parseInt(req.query.pageSize as string, 100) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const custom_design = await service.search(queryParams, pageSize, pageNumber);

    res.status(200).json({
      status: 'success',
      custom_design,
    });
  }));

  router.get("/customizer/design-id/:productId", wrapHandler(async (req, res) => {
    const service: CustomDesignService = req.scope.resolve('customDesignService');
    const { productId } = req.params;
    const custom_design = await service.getIdAndProductId(productId);
    res.status(200).json({
      status: 'success',
      custom_design: custom_design,
    });
  }));
  router.get("/customizer/design-search/:productId/:orderId/:designName", wrapHandler(async (req, res) => {
    const service: CustomDesignService = req.scope.resolve('customDesignService');
    const { productId, orderId, designName } = req.params;
    const custom_design = await service.searchIdAndProductId(productId, orderId, designName);
    res.status(200).json({
      status: 'success',
      custom_design: custom_design,
    });
  }));

  router.post("/customizer/design", json({ limit: '50mb' }), wrapHandler(async (req, res) => {
    const service: CustomDesignService = req.scope.resolve('customDesignService');
    const { data } = req.body;
    var d = JSON.parse(decompress(data))
    var toSave = { ...d }
    var result = await service.create(toSave)
    res.status(200).json({
      status: "success",
      result: { id: result.id },
    });
  }));

  router.put("/customizer/design/:id", wrapHandler(async (req, res) => {
    const service: CustomDesignService = req.scope.resolve('customDesignService');
    const { id } = req.params;
    const { data } = req.body;
    var d = JSON.parse(decompress(data))
    var toSave = { ...d }
    const result = await service.update(id, toSave);
    if (result) {
      res.status(201).json({
        result: { id: result.id },
      });
    } else {
      res.status(201).json({
        status: 'id not found',
        result
      });
    }
  }));

  router.delete("/customizer/design/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('customDesignService');
    const result = await service.delete(id);
    const { affected } = result;
    res.status(200).json({
      status: 'success',
      affected,
    });
  }));

  return router;
}
