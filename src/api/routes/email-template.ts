import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();

export default function getEmailTemplateRouter(CorsOptions): Router {

  router.use(cors(CorsOptions), json());

  router.get('/admin/email-template', wrapHandler(async (req, res) => {
    const email_templateService = req.scope.resolve('emailTemplateService');
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    delete req.query.pageNumber
    delete req.query.pageSize
    const queryParams = req.query;

    const email_templates = await email_templateService.search(queryParams, pageSize, pageNumber);
    res.status(200).json({
      status: 'success',
      email_templates,
    });
  }));

  router.delete('/admin/email-template', wrapHandler(async (req, res) => {
    const email_templateService = req.scope.resolve('emailTemplateService');
    const { id } = req.body;
    const result = await email_templateService.delete(id);
    res.status(201).json({
      status: 'success',
      message: result,
    });
  }));

  router.post("/admin/email-template", wrapHandler(async (req, res) => {
    const email_templateService = req.scope.resolve('emailTemplateService');
    if (!req.body) {
      res.json({ status: 'error', message: 'body is empty', body: req.body });
      return;
    }
    const { name, type, description } = req.body;

 

    const email_template = await email_templateService.create(name, type, description);
    res.json({
      status: 'success',
      message: "email_template created",
      id: email_template.id,
    });
  }));

  router.put("/admin/email-template/:id", wrapHandler(async (req, res) => {
    const email_templateService = req.scope.resolve('emailTemplateService');
    const { id } = req.params;
    const { name, type, description } = req.body;


    const email_template = await email_templateService.update(id, { name, type, description });
    res.json({
      status: 'success',
      message: "email_template updated",
      email_template,
    });
  }));

  router.get('/admin/email-template/:id', wrapHandler(async (req, res) => {
    const email_templateService = req.scope.resolve('emailTemplateService');
    const { id } = req.params;

    const email_template = await email_templateService.findById(id);

    if (!email_template) {
      res.json({
        status: 'error',
        message: 'email_template not found',
      });
      return;
    }

    res.json({
      status: 'success',
      email_template,
    });
  }));
  router.delete('/admin/email-template/:id', wrapHandler(async (req, res) => {
    const email_templateService = req.scope.resolve('emailTemplateService');
    const { id } = req.params;

    const result = await email_templateService.delete(id);

    if (!result) {
      res.json({
        status: 'error',
        message: 'email_template not found',
      });
      return;
    }

    res.json({
      status: 'success',
      result,
    });
  }));

  return router;
}
