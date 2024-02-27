import getGraphicRouter from "./routes/graphic";
import getGraphicSizesRouter from "./routes/graphic-size";
import getJobCardsRouter from "./routes/job-cards";
import getSizeColumnRouter from "./routes/size-column";
import getSizeGuideRouter from "./routes/size-guide";
import getCustomizerAreasRouter from "./routes/customizer/customizer-areas";
import getTextSettingsRouter from "./routes/customizer/text-settings";
import getCustomColorGroupRouter from "./routes/custom-color-group";
import getCustomMaterialRouter from "./routes/customizer/custom-material";
import getCustomizerColorGroupRouter from "./routes/customizer/customizer-color-group";
import getCustomProductSizingRouter from "./routes/customizer/custom-product-sizing";
import getMaterialTypesRouter from "./routes/customizer/material-type";
import getCustomProductStyleRouter from "./routes/customizer/custom-product-style";
import getCustomSizingRouter from "./routes/customizer/custom-sizing";
import { getCustomizerNameRouter } from "./routes/customizer/customizer-name";
import { getGalleryRouter } from "./routes/gallery";
import { getCustomProductRouter } from "./routes/products/custom-product";
import getCustomProductSettingsRouter from "./routes/customizer/custom-prodcut-setting";
import getCustomStyleOption from "./routes/customizer/custom-style-option";
import getCustomizerGraphicRouter from "./routes/customizer/customizer-graphic";
import { getConfigFile } from "medusa-core-utils"
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import getFavoriteRouter from "./routes/products/favorite";
import { Router } from "express";
import { CartService, OrderService, ProductCollectionService, wrapHandler } from "@medusajs/medusa";
import ProductCategoryService from "../services/product-category";
import getEmailRouter from "./routes/email";
import getUserRouter from "./routes/user";
import getGraphicMainRouter from "./routes/customizer/graphic-main";
import getGraphicSizeRouter from "./routes/graphic-size";
import getCustomDesignRouter from "./routes/custom-design";
import FileService from '@medusajs/medusa/dist/services/file'
import multer from "multer";
import bodyParser from "body-parser";
import getProductionRouter from "./routes/production";
import getProductionTypeRouter from "./routes/production-type";
import getJobCardCommentRouter from "./routes/job-card-comment";
import getCurrencyRate from "./routes/get-currency-rate";
import getDashboardRoute from "./routes/dashboard";
import LocalFileService from "../services/local-file";
import getEmailTemplateRouter from "./routes/email-template";
import getCustomizerNameCrystalRouter from "./routes/customizer/customizer-name-crystal";
import getCustomizerNameFinishesRouter from "./routes/customizer/customizer-name-finish";
import CustomOrderService from "../services/custom-order";
import CustomerService from "../services/customer";
import fs from 'fs'
import path from 'path'
import IdempotencyKeyService from "../services/idempotency-key";
import SitemapService from "../services/sitemap";

const upload = multer({ dest: 'uploads/' })

export default (rootDirectory, pluginOptions) => {

  const { configModule: { projectConfig } } = getConfigFile(
    rootDirectory,
    "medusa-config"
  ) as { configModule: ConfigModule }

  const CorsOptions = {
    origin: [
      projectConfig.store_cors,
      projectConfig.admin_cors,
      process.env.STORE_ADD_CORS,
      ...(process.env.STORE_ADD_CORS2 ? process.env.STORE_ADD_CORS2.split(',') : [])
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }

  const router = Router();

  function replaceAll(input: string, searchValue: string, replaceValue: string): string {
    return input.split(searchValue).join(replaceValue);
  }


  router.get('/api/sitemap', wrapHandler(async (req, res) => {
    var service: SitemapService = req.scope.resolve('sitemapService');
    var data = await service.getURLs();
    res.status(200).json({ status: 'success', data });
  }));
  router.get('/api/sitemap/gallery', wrapHandler(async (req, res) => {
    var service: SitemapService = req.scope.resolve('sitemapService');
    var galleries = await service.galleryURLs();
    res.status(200).json({ status: 'success', galleries });
  }));

  router.get('/api/refresh-db', wrapHandler(async (req, res) => {
    var service: IdempotencyKeyService = req.scope.resolve('idempotencyKeyService');
    var count = await service.clearFinished();
    res.status(200).json({ status: 'success', message: 'Idempotency keys cleared: ' + count });
  }));

  router.get("/.well-known/pki-validation/E7DF2BB7268AAF58983C6D8591558E66.txt", (req, res) => {
    const validationPath = path.join(process.cwd(), 'validation.txt');
    const validationData = fs.readFileSync(validationPath, 'utf-8');

    res.setHeader('Content-Type', 'text/plain');
    res.send(validationData);
  });

  router.post('/store/upload/svg', upload.single('file'), wrapHandler(async (req, res) => {

    const fileservice: LocalFileService = req.scope.resolve('localFileService')
    let file = req.file;
    file.originalname = replaceAll(file.originalname, ' ', '-');
    var { url, key } = await fileservice.upload(file);
    res.status(200).json({
      url,
      key,
    });
  }))

  router.post('/store/upload/temp', upload.single('file'), wrapHandler(async (req, res) => {
    const fileservice: LocalFileService = req.scope.resolve('localFileService')
    let file = req.file;
    file.originalname = replaceAll(file.originalname, ' ', '-');
    var { url, key } = await fileservice.upload(file, 'temp', 'application/json');
    res.status(200).json({
      url,
      key,
    });
  }))

  router.get('/store/file', wrapHandler(async (req, res) => {
    const fileservice: LocalFileService = req.scope.resolve('localFileService')
    let { key } = req.query;
    var response = JSON.parse(await fileservice.find(key as any));
    res.status(200).json(response);
  }))


  router.post('/store/upload', upload.single('file'), wrapHandler(async (req, res) => {
    const fileservice: FileService = req.scope.resolve('fileService')
    let file = req.file;
    file.originalname = replaceAll(file.originalname, ' ', '-');
    var { url } = await fileservice.upload(file);
    res.status(200).json({
      url,
    });
  }))

  router.delete('/store/upload', wrapHandler(async (req, res) => {
    const fileservice: LocalFileService = req.scope.resolve('localFileService')
    let { url } = req.query;
    var result = await fileservice.delete(url as string);
    res.status(200).json({
      url,
      result,
    });
  }))

  router.post('/store/orders/create', bodyParser.json(), wrapHandler(async (req, res) => {
    const { cart, items } = req.body;
    const service: CustomOrderService = req.scope.resolve('customOrderService');
    var order_result = await service.createNewOrder(cart);
    res.status(200).json({
      order_result,
    })
  }))

  // router.get('/admin/deleteOrder/:id', wrapHandler(async (req, res) => {
  //   const { id } = req.params;
  //   const service: OrderService = req.scope.resolve("orderService")
  //   var result = await service.(id);
  //   res.status(200).json({ result })
  // }))
  router.get('/store/customer/:email', wrapHandler(async (req, res) => {
    const { email } = req.params;
    const service: OrderService = req.scope.resolve("orderService")
    var result = await service.list({ email: email });
    res.status(200).json({ result })
  }))


  router.get('/store/get-order-metadata/:id', bodyParser.json(), wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: OrderService = req.scope.resolve('orderService');
    var order_result = await service.retrieve(id);
    res.status(200).json({
      order_result,
    })
  }))

  router.get('/admin/order-search', wrapHandler(async (req, res) => {
    const orderService = req.scope.resolve('updateVariantService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber;
    delete req.query.pageSize;
    const queryParams = req.query;

    const orders = await orderService.searchOrder(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      orders,
    });
  }));

  router.post('/store/orders/cancel', bodyParser.json(), wrapHandler(async (req, res) => {
    const { order_id } = req.body;
    const service: OrderService = req.scope.resolve('orderService');
    var order_result = await service.cancel(order_id);
    res.status(200).json({
      order_result,
    })
  }))

  router.get('/store/collections/handle/:handle', bodyParser.json(), wrapHandler(async (req, res) => {
    const { handle } = req.params;
    const service: ProductCollectionService = req.scope.resolve('productCollectionService');
    try {
      var collection = await service.retrieveByHandle(handle);
      res.status(200).json({
        collection,
      })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }))

  router.post('/store/lineitems/:cart_id/:id', bodyParser.json(), wrapHandler(async (req, res) => {
    const { id, cart_id } = req.params ?? { id: '', cart_id: '' };
    const service: CartService = req.scope.resolve('cartService');
    var cart = await service.updateLineItem(cart_id, id, req.body);
    await service.addOrUpdateLineItems(cart.id, cart.items)
    cart = await service.updateLineItem(cart.id, id, req.body)
    res.status(200).json({
      cart,
    })
  }))

  router.get('/store/collection-categories/:handle', wrapHandler(async (req, res) => {
    const { handle } = req.params;
    console.log('collection handle', handle)
    const service: ProductCategoryService = req.scope.resolve('productCategoryService');
    const collection_categories = [];
    const all_categories = await service.listAll();
    for (var category of all_categories) {
      const has_product = await service.hasProductInCollection(category.handle, handle as string);
      if (has_product) {
        collection_categories.push(category);
      }
    }
    res.status(200).json({ collection_categories })
  }))

  router.post('/admin/updateorder/:id', bodyParser.json(), wrapHandler(async (req, res) => {
    const { id } = req.params ?? { id: '' };

    const service = req.scope.resolve('orderService');
    var result = await service.update(id, req.body);
    res.status(200).json({
      result,
    })
  }))

  router.get('/store/product-categories/:id', wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: ProductCategoryService = req.scope.resolve('productCategoryService');
    const product_category = await service.retrieve(id);
    res.status(200).json({ product_category })
  }));

  router.get('/store/category', wrapHandler(async (req, res) => {
    const { product_id } = req.query;
    const service: ProductCategoryService = req.scope.resolve('productCategoryService');
    var category = await service.findByProductId(product_id as string);
    res.status(200).json({ category })
  }));

  const customerRouter = getUserRouter(CorsOptions);
  const graphicRouter = getGraphicRouter(CorsOptions)
  const graphicSizesRouter = getGraphicSizesRouter(CorsOptions)
  const jobCardsRouter = getJobCardsRouter(CorsOptions)
  const sizeColumnRouter = getSizeColumnRouter(CorsOptions)
  const sizeGuideRouter = getSizeGuideRouter(CorsOptions)
  const customizerAreasRouter = getCustomizerAreasRouter(CorsOptions)
  const textSettingsRouter = getTextSettingsRouter(CorsOptions)
  const customColorGroupRouter = getCustomColorGroupRouter(CorsOptions)
  const customMaterialRouter = getCustomMaterialRouter(CorsOptions)
  const customizerColorGroupRouter = getCustomizerColorGroupRouter(CorsOptions)
  const customizerNameRouter = getCustomizerNameRouter(CorsOptions)
  const customProductSizingRouter = getCustomProductSizingRouter(CorsOptions)
  const materialsTypesRouter = getMaterialTypesRouter(CorsOptions)
  const customProductStyleRouter = getCustomProductStyleRouter(CorsOptions)
  const galleryRouter = getGalleryRouter(CorsOptions)
  const customProductRouter = getCustomProductRouter(CorsOptions)
  const customSizingRouter = getCustomSizingRouter(CorsOptions)
  const customProductSettingsRouter = getCustomProductSettingsRouter(CorsOptions)
  const customStyleOption = getCustomStyleOption(CorsOptions)
  const customizerGraphicRouter = getCustomizerGraphicRouter(CorsOptions)
  const emailRouter = getEmailRouter(CorsOptions)
  const favoriteRouter = getFavoriteRouter(CorsOptions);
  const graphicMainRouter = getGraphicMainRouter(CorsOptions);
  const graphicSizeRouter = getGraphicSizeRouter(CorsOptions);
  const customDesignRouter = getCustomDesignRouter(CorsOptions);
  const productionRouter = getProductionRouter(CorsOptions);
  const productionTypeRouter = getProductionTypeRouter(CorsOptions);
  const jobCardCommentRouter = getJobCardCommentRouter(CorsOptions);
  const currencyRate = getCurrencyRate(CorsOptions);
  const dashboardRoute = getDashboardRoute(CorsOptions);
  const emailTemplateRouter = getEmailTemplateRouter(CorsOptions);
  const customizerNameFinishesRouter = getCustomizerNameFinishesRouter(CorsOptions);
  const customizerNameCrystalRouter = getCustomizerNameCrystalRouter(CorsOptions);

  return [
    customizerNameCrystalRouter,
    customizerNameFinishesRouter,
    emailTemplateRouter,
    dashboardRoute,
    currencyRate,
    jobCardCommentRouter,
    productionTypeRouter,
    productionRouter,
    customDesignRouter,
    graphicSizeRouter,
    graphicMainRouter,
    customizerGraphicRouter,
    customStyleOption,
    customProductSettingsRouter,
    router,
    customerRouter,
    emailRouter,
    customStyleOption,
    customProductSettingsRouter,
    router,
    emailRouter,
    customSizingRouter,
    customProductRouter,
    galleryRouter,
    customProductStyleRouter,
    materialsTypesRouter,
    customProductSizingRouter,
    customizerNameRouter,
    customizerColorGroupRouter,
    customColorGroupRouter,
    customMaterialRouter,
    textSettingsRouter,
    customizerAreasRouter,
    sizeGuideRouter,
    sizeColumnRouter,
    jobCardsRouter,
    graphicSizesRouter,
    graphicRouter,
    favoriteRouter,
  ];
}