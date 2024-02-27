import { Router } from "express";
import { json } from 'body-parser';;
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import GalleryService from "../../services/gallery";

const router = Router();

export function getGalleryRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json())
  router.get('/store/gallery', wrapHandler(async (req, res) => {
    const galleryService: GalleryService = req.scope.resolve('galleryService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const gallery = await galleryService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      gallery,
    });
  }));

  router.get('/store/gallery/:handle', wrapHandler(async (req, res) => {
    const galleryService: GalleryService = req.scope.resolve('galleryService');
    const { handle } = req.params;
    const gallery = await galleryService.findOne(handle);
    delete gallery?.custom_design_id?.design_data?.canvas;
    delete gallery?.custom_design_id?.design_data?.layers;
    if (!gallery) {
      res.status(404).json({
        status: 'error',
        message: 'Gallery not found',
      });
      return;
    }
    res.json({
      status: 'success',
      gallery: gallery,
    });
  }));

  router.delete('/store/gallery/:id', json(), wrapHandler(async (req, res) => {
    const galleryService = req.scope.resolve('galleryService');
    const { id } = req.params;
    const result = await galleryService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/store/gallery", json(), wrapHandler(async (req, res) => {
    const galleryService = req.scope.resolve('galleryService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }


    const gallery = await galleryService.create(req.body);

    res.json({
      status: 'success',
      message: "Gallery created",
      id: gallery.id,
    });
  }));

  router.put("/store/gallery/:id", json(), wrapHandler(async (req, res) => {
    const galleryService = req.scope.resolve('galleryService');
    const { id } = req.params;

    const updatedGallery = await galleryService.update(id, req.body);

    res.json({
      status: 'success',
      message: "Gallery updated",
      gallery: updatedGallery,
    });
  }));

  return router;
}
