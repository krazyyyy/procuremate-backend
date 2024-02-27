import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();

export default function getEmailRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/send', wrapHandler(async (req, res) => {
    const { email, name } = req.query;
    const sendgridService = req.scope.resolve("sendgridService")
    const sendOptions = {
      templateId: process.env.SENDGRID_REGISTER_TEMPLATE_ID,
      from: process.env.SENDGRID_FROM,
      to: email,
      dynamicTemplateData: { username: name, email },
    }
    try {
      var result = await sendgridService.sendEmail(sendOptions)
      res.status(200).json({ result })
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message })
    }
  }))



  router.post('/admin/production-email', wrapHandler(async (req, res) => {
    const sendgridService = req.scope.resolve("sendgridService")
    const { email, name, description, image_url } = req.body;
    const sendOptions = {
      templateId: process.env.PRODUCTION_EMAIL,
      from: process.env.SENDGRID_FROM,
      to: email,
      dynamicTemplateData: { username: name, email, description, image_url },
    }
    try {

      var result = await sendgridService.sendEmail(sendOptions)
      res.status(200).json({ result })
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message })
    }
  }))

  router.post('/admin/status-update', wrapHandler(async (req, res) => {
    const sendgridService = req.scope.resolve("sendgridService");
    const { email, title, description } = req.body;
    
    const emailContent = `Title: ${title}\n\n${description}`;
    const sub = `Status Update - ${title}`
    const sendOptions = {
      from: process.env.SENDGRID_FROM,
      to: email,
      subject: title,
      text: emailContent
    };
  
    try {
      const result = await sendgridService.sendEmail(sendOptions);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }));
  
  router.post('/store/status-created', wrapHandler(async (req, res) => {
    const sendgridService = req.scope.resolve("sendgridService");
    const { email, title, description } = req.body;
    
    const emailContent = `Title: ${title}\n\n${description}`;
    const sub = `Status Update - ${title}`
    const sendOptions = {
      from: process.env.SENDGRID_FROM,
      to: email,
      subject: title,
      text: emailContent
    };
  
    try {
      const result = await sendgridService.sendEmail(sendOptions);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }));
  


  router.get('/send/coming-soon', wrapHandler(async (req, res) => {
    const { email } = req.query;
    const sendgridService = req.scope.resolve("sendgridService")
    const sendOptions = {
      templateId: process.env.SENDGRID_COMING_SOON_TEMPLATE_ID,
      from: process.env.SENDGRID_FROM,
      to: 'sales@fiercefightgear.com',
      dynamicTemplateData: { email },
    }

    try {
      var result = await sendgridService.sendEmail(sendOptions)
      res.status(200).json({ result })
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message })
    }
  }))

  return router;
}
