import { Router } from "express";
import { json } from 'body-parser';
import { Customer, wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import FavoriteService from "../../../services/favorite";

const router = Router();

type FavRecord = {
  customer_id: string;
  product_id: string;
}

export default function getFavoriteRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/store/products/favorites/:id', wrapHandler(async (req, res) => {
    try {

      const service: FavoriteService = req.scope.resolve('favoriteService');
      const { id } = req.params;
      const result = await service.list();
      let favorites = [];
      let temp: FavRecord[] = [];
      for (var item of result) {
        var cus = item?.customer as any as Customer;
        if (cus?.id === id) {
          const prod = item.product as any;
          if (prod && !temp.includes({ customer_id: id, product_id: prod?.id })) {
            temp.push({ customer_id: id, product_id: prod?.id })
            favorites.push(item);
          }
        }
      }

      res.json({
        status: 'success',
        favorites,
        temp
      });
    } catch (error) {
      console.error(error)
      res.json({
        error
      })
    }
  }));

  router.post("/store/products/favorites", json(), wrapHandler(async (req, res) => {
    const service: FavoriteService = req.scope.resolve('favoriteService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const { product_id, customer_id } = req.body;

    if (!product_id) {
      res.json({
        status: 'error',
        message: 'product_id is mandatory',
      });
      return;
    }

    const fav = await service.create(product_id, customer_id);
    res.json({
      status: 'success',
      message: "Favorite added",
      fav,
    });
  }));

  router.delete('/store/products/favorites/:id', wrapHandler(async (req, res) => {
    const service: FavoriteService = req.scope.resolve('favoriteService');
    const { id } = req.params;
    const result = await service.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));



  return router;
}
