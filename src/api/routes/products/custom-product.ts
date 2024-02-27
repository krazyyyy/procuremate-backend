import { Router } from "express"
import { json } from 'body-parser'
import CustomProductService from "../../../services/custom-product";
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";

const router = Router()
export function getCustomProductRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json())
  router.get('/product/custom-product/:id', wrapHandler( async (req, res) => {
    const { id } = req.params;
    const service: CustomProductService = req.scope.resolve('customProductService');
    var custom_product = await service.get({
      where: { id },
      relations: ['product_id'] 
    },)

    res.status(200).json({ custom_product })
  }))

  router.get("/product/custom-product", wrapHandler(async (req, res) => {
    const service: CustomProductService = req.scope.resolve('customProductService');
    var custom_products = await service.list();
    res.status(200).json({
      status: 'success',
      custom_products,
    })
  }));


  router.post("/product/custom-product", json(), wrapHandler(async (req, res) => {
    const {
      code,
      sale_amount,
      sale_start_date,
      sale_end_date,
      product_id,
      template_image
    } = req.body

    const service: CustomProductService = req.scope.resolve('customProductService');
    var newProduct = { code, sale_amount, sale_start_date, sale_end_date, product_id, template_image }

    var stat = await service.create(newProduct)
    res.status(200).json({
      status: "success",
      stat,

    })
  }));

  router.put("/product/custom-product/:id", wrapHandler(async (req, res) => {
    const service: CustomProductService = req.scope.resolve('customProductService');
    const { id } = req.params;
    var result = await service.update(id, req.body);
    if (result) {
      res.status(201).json({
        result
      })
    } else
      res.status(201).json({
        status: 'id not found',
        result
      })

  }));

  router.delete("/product/custom-product/:id", wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service = req.scope.resolve('customProductService');
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