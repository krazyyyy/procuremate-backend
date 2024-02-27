import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import JobCardService from "../../services/jobCards";
import CustomDesignService from "../../services/custom-design";
import LocalFileService from "../../services/local-file";
import { CustomDesign } from "../../models/custom-design";

const router = Router();


export default function getJobCardsRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());



  const loadAndSaveDesign = async (product_id: string, customer_id: string, customDesignService: CustomDesignService, fileService: LocalFileService) => {
    let key = `temp/${product_id}.json`;
    var data = JSON.parse(await fileService.find(key as any));
    var toSave = {
      ...data,
      customer_id,
      product_id
    }
    const design = await saveCustomDesign(customDesignService, toSave);
    return design;
  }

  const saveCustomDesign = async (service: CustomDesignService, data: Partial<CustomDesign>) => {
    var result = await service.create(data)
    return result
  }
  const createJobCards = async (
    order_id: string,
    customer_id: string,
    service: JobCardService,
    designService: CustomDesignService,
    fileService: LocalFileService,
    enrichedItems: any[]) => {
    var requests = [];
    var comment = ''
    for (var item of enrichedItems) {
      var payload = {
        order_id: order_id,
        product_id: item.variant.product_id,
        type: (item?.metadata?.type ?? 'ready-made') as any,
        custom_design_id: (item?.metadata?.custom_design_id as any),
        design_data: {},
        comment: (item?.metadata?.comment ?? comment) as string,
        fight_date: item?.metadata.fight_date as any,
      }
      if (item?.metadata?.custom_design_id === 'fetch') {
        var { id } = await loadAndSaveDesign(item.variant.product_id, customer_id, designService, fileService)
        payload.custom_design_id = id;
      }
      if (payload.custom_design_id === 'fetch') {
        delete payload.custom_design_id;
      }
      requests.push(createJobCard(service, payload))
    }
    var responses = await Promise.all(requests);
    return responses;
  }


  const createJobCard = async (service: JobCardService, payload: any) => {
    if (!payload) {
      return { status: 'error', message: 'payload is empty' };
    }
    const {
      type,
      fight_date,
      comment,
      product_id,
      order_id,
      design_data,
      custom_design_id
    } = payload;

    if (!product_id || !order_id) {
      return {
        status: 'error',
        message: 'type, product_id, and order_id are mandatory',
      };
    }
    var exists = await service.findOne({ where: { order_id: { id: order_id }, product_id: { id: product_id } } })
    if (exists) {
      var result = await service.update(exists.id, { type, fight_date, comment, design_data, custom_design_id })
      return result;
    }

    const { status, jobCard, error } = await service.create(type, comment, fight_date, product_id, order_id, design_data, custom_design_id);

    if (status === 'success') {
      return {
        status: 'success',
        message: "Job Card created",
        job_card: jobCard
      }
    } else {
      return {
        status: 'error',
        error: error,
      }
    }
  }

  router.post('/store/job-cards/save', json(), wrapHandler(async (req, res) => {
    const service: JobCardService = req.scope.resolve('jobCardsService');
    const fileservice: LocalFileService = req.scope.resolve('localFileService')
    const customDesignService: CustomDesignService = req.scope.resolve('customDesignService');
    const { items, customer_id, order_id } = req.body;
    var result = await createJobCards(order_id, customer_id, service, customDesignService, fileservice, items);
    res.status(200).json({ result })
  }))

  router.get('/store/job-cards', wrapHandler(async (req, res) => {
    const jobCardsService: JobCardService = req.scope.resolve('jobCardsService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber;
    delete req.query.pageSize;
    const queryParams = req.query;

    const jobCards = await jobCardsService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      jobCards,
    });
  }));

  router.delete('/store/job-cards', json(), wrapHandler(async (req, res) => {
    const jobCardsService = req.scope.resolve('jobCardsService');
    const { id } = req.body;
    const { status, error } = await jobCardsService.delete(id);

    if (status === 'success') {
      res.status(201).json({
        status: 'success',
        message: 'Job Card deleted successfully',
      });
    } else {
      res.status(500).json({
        status: 'error',
        error: error,
      });
    }
  }));

  router.post("/store/job-cards", json(), wrapHandler(async (req, res) => {
    const jobCardsService: JobCardService = req.scope.resolve('jobCardsService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const {
      type,
      fight_date,
      comment,
      product_id,
      order_id,
      design_data,
      custom_design_id
    } = req.body;

    if (!product_id || !order_id) {
      res.json({
        status: 'error',
        message: 'type, product_id, and order_id are mandatory',
      });
      return;
    }
    var exists = await jobCardsService.findOne({ where: { order_id: { id: order_id }, product_id: { id: product_id } } })
    if (exists) {
      var result = await jobCardsService.update(exists.id, { type, fight_date, comment, design_data, custom_design_id })
      res.json({
        result,
      });
      return;
    }

    const { status, jobCard, error } = await jobCardsService.create(type, comment, fight_date, product_id, order_id, design_data, custom_design_id);

    if (status === 'success') {
      res.json({
        status: 'success',
        message: "Job Card created",
        job_card: jobCard
      });
    } else {
      res.status(500).json({
        status: 'error',
        error: error,
      });
    }
  }));

  router.put("/store/job-cards/:id", wrapHandler(async (req, res) => {
    const jobCardsService = req.scope.resolve('jobCardsService');
    const { id } = req.params;
    const { type, fight_date, product_id, order_id, design_data, custom_design_id } = req.body;

    if (!product_id || !order_id) {
      res.json({
        status: 'error',
        message: 'type, product_id, and order_id are mandatory',
      });
      return;
    }

    const { status, jobCard, error } = await jobCardsService.update(id, { type, fight_date, product_id, order_id, design_data, custom_design_id });

    if (status === 'success') {
      res.json({
        status: 'success',
        message: "Job Card updated",
        jobCard,
      });
    } else {
      res.status(500).json({
        status: 'error',
        error: error,
      });
    }
  }));

  router.get('/store/job-cards/:id', wrapHandler(async (req, res) => {
    const jobCardsService = req.scope.resolve('jobCardsService');
    const { id } = req.params;

    const { status, job_card, error } = await jobCardsService.findById(id);
    if (status === 'success') {
      if (!job_card) {
        res.json({
          status: 'error',
          message: 'Job Card not found',
        });
      } else {
        res.json({
          status: 'success',
          job_card,
        });
      }
    } else {
      res.status(500).json({
        status: 'error',
        error: error,
      });
    }
  }));

  return router;
}
