import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import DashboardService from "../../services/dashboard";


const router = Router();

export default function getDashboardRoute(CorsOptions): Router {

  router.use(cors(CorsOptions), json());
  router.get('/dashboard/sales/:start_date/:end_date', wrapHandler(async (req, res) => {
    const dashboardService: DashboardService = req.scope.resolve('dashboardService');
    const { start_date, end_date } = req.params
    const data = await dashboardService.getOrdersByDateRange(start_date, end_date)

    res.status(200).json({
      data
    })

  }));
  router.get('/dashboard/orders/:start_date/:end_date', wrapHandler(async (req, res) => {
    const dashboardService = req.scope.resolve('dashboardService');
    const { start_date, end_date } = req.params
    const data = await dashboardService.getOrderCountByDateRange(start_date, end_date)

    res.status(200).json({
      data
    })

  }));
  // router.get('/dashboard/sales/:start_date/:end_date', wrapHandler(async (req, res) => {
  router.get('/dashboard/period-details', wrapHandler(async (req, res) => {
    const dashboardService = req.scope.resolve('dashboardService');
    const { start_date, end_date } = req.params
    const data = await dashboardService.getPeriodDetails(start_date, end_date)

    res.status(200).json({
      data
    })

  }));

  router.get('/dashboard/product-sales/:start_date/:end_date', wrapHandler(async (req, res) => {
    const dashboardService = req.scope.resolve('dashboardService');
    const { start_date, end_date } = req.params
    const data = await dashboardService.getProductsSoldByDateRange(start_date, end_date)

    res.status(200).json({
      data
    })

  }));

  router.get('/dashboard/day-order/:start_date/:end_date/:ready_made', wrapHandler(async (req, res) => {
    const dashboardService = req.scope.resolve('dashboardService');
    const { start_date, end_date, ready_made } = req.params
    let ready = false
    if (ready_made === "1") {
      ready = true
    }
    const data = await dashboardService.getOrderDetailsByDateRange(start_date, end_date, ready)

    res.status(200).json({
      data
    })

  }));


  return router;
}
