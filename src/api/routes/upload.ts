import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";

const router = Router();

export default function getFileRouter(CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/send', wrapHandler(async (req, res) => {
    const { email, name } = req.query;
    const sendgridService = req.scope.resolve("local")
    const sendOptions = {
      templateId: "d-171a961e11c54ada9e96ba5f8221142b",
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
  router.get('/send/coming-soon', wrapHandler(async (req, res) => {
    const { email } = req.query;
    const sendgridService = req.scope.resolve("sendgridService")
    const sendOptions = {
      templateId: "d-171a961e11c54ada9e96ba5f8221142b",
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
