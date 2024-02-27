import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();
export default function getJobCardCommentRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/admin/job-card-comment', wrapHandler(async (req, res) => {
    const jobCardCommentService = req.scope.resolve('jobCardCommentService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const job_card_comment = await jobCardCommentService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      job_card_comment,
    });
  }));

  router.delete('/admin/job-card-comment',  json(), wrapHandler(async (req, res) => {
    const jobCardCommentService = req.scope.resolve('jobCardCommentService');
    const { id } = req.body;
    const result = await jobCardCommentService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/admin/job-card-comment",  json(), wrapHandler(async (req, res) => {
    const jobCardCommentService = req.scope.resolve('jobCardCommentService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }

    const job_card_comment = await jobCardCommentService.create(req.body);

    res.json({
      status: 'success',
      message: "Job Card Comment created",
      id: job_card_comment.id,
    });
  }));

  router.put("/admin/job-card-comment/:id",  json(), wrapHandler(async (req, res) => {
    const jobCardCommentService = req.scope.resolve('jobCardCommentService');
    const { id } = req.params;

    const job_card_comment = await jobCardCommentService.update(id, req.body);

    res.json({
      status: 'success',
      message: "Job Card Comment updated",
      job_card_comment,
    });
  }));

  router.get('/admin/job-card-comment/:id',  wrapHandler(async (req, res) => {
    const jobCardCommentService = req.scope.resolve('jobCardCommentService');
    const { id } = req.params;

    const job_card_comment = await jobCardCommentService.findById(id);

    if (!job_card_comment) {
      res.json({
        status: 'error',
        message: 'Job Card Comment not found',
      });
      return;
    }

    res.json({
      status: 'success',
      job_card_comment,
    });
  }));

  return router;
}
