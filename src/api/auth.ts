import { AuthService, UserService } from "@medusajs/medusa";
import { Request, Response } from "express";

export default async function checkAuthentication(req: Request, res: Response, next) {
  const token = req.headers.authorization;
  const authService = req.scope.resolve('authService');
  // console.log(new Buffer(req.headers.authorization.split(" ")[1], 'base64').toString())
  try {
    const authResult = await authService.authenticateAPIToken(req.headers.token);
    //   const authResult = await authService.authenticate(token);
    if (!authResult.success || !authResult.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Store the authenticated user in the request object for further use
    req.user = authResult.user;
    next();
  } catch (err) {

    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

