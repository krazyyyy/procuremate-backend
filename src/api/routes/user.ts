import { Router } from "express";
import { json } from 'body-parser';
import { authenticate, wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import CustomerService from "../../services/customer";

const router = Router();

export default function getUserRouter(CorsOptions: cors.CorsOptions): Router {
  router.use(cors(CorsOptions), json());

  router.get('/user/forgot-password', wrapHandler(async (req, res) => {
    const { email } = req.query;
    const service: CustomerService = req.scope.resolve("customerService")
    if (!email) {
      res.status(400).send({ status: 'error', message: "email is required" })
    }
    var customer = await service.retrieveRegisteredByEmail(email as string);
    if (!customer) {
      res.status(400).send({ status: 'error', message: "Not found" });
    }
    let token: string = await service.generateResetPasswordToken(customer.id);
    res.status(200).json({ token, status: 'success' })
  }))

  router.post('/store/customer/create', json(), wrapHandler(async (req, res) => {
    var customer: any;
    const { email } = req.body;
    const sendgridService = req.scope.resolve("sendgridService")
    const service: CustomerService = req.scope.resolve('customerService');
    if (!email) res.status(400).send("Email is required");
    const existingCustomer = await service.list({ email });
    if (existingCustomer.length > 0) {
      // Customer already exists
      customer = existingCustomer[0];
      // Customer doesn't have an account - create an account for user;
      if (customer && !customer.has_account) {
        await service.updateHasAccount(customer.id, true);
        await service.update(customer.id, { password: '12345678' })
      }
    } else {
      // Create a new customer
      customer = await service.create({ email, password: '12345678' });
    }
    const sendOptions = {
      templateId: 'd-3d73c0dac6f8470f8e511d05dac354de',
      from: process.env.SENDGRID_FROM,
      to: email,
      dynamicTemplateData: {
        password: '12345678',
      }
    }
    await sendgridService.sendEmail(sendOptions)
    console.log('customer is 🕵🏻‍♀️', customer)
    res.status(200).json({ email, password: '12345678' })
  }))

  router.get('/admin/customers', json(), wrapHandler(async (req, res) => {
    const service: CustomerService = req.scope.resolve('customerService');
    const selector = {};
      interface Config {
        take?: number;
        skip?: number;
        relations: string[];
        // Include other properties of config here
    }
  
    const config: Config = {
        ...req.query,
        relations: ['orders'], // if you always want to expand orders
    };
    
    // Check if offset and limit exist in req.query
    if ('offset' in req.query && 'limit' in req.query) {
        config.skip = Number(req.query.offset);
        config.take = Number(req.query.limit);
    }
    
    
    const result = await service.list(selector, config);
    res.json(result);
}));

  

  router.get('/user/reset-password', wrapHandler(async (req, res) => {
    const { email } = req.query;
    const sendgridService = req.scope.resolve("sendgridService")
    const service: CustomerService = req.scope.resolve("customerService")
    if (!email) {
      res.status(400).send({ status: 'error', message: "email is required" })
    }
    try {
      var customer = await service.retrieveRegisteredByEmail(email as string);
      const password = generateRandomPassword();
      const sendOptions = {
        templateId: 'd-3d73c0dac6f8470f8e511d05dac354de',
        from: process.env.SENDGRID_FROM,
        to: email,
        dynamicTemplateData: {
          password,
        }
      }
      var result = await sendgridService.sendEmail(sendOptions)
      await service.update(customer.id, { password: password })
      res.status(200).json({ status: 'success', result })
    } catch (error) {
      res.json({
        status: 'error',
        message: error.message,
      })
    }
  }))

  router.delete('/user/:id', wrapHandler(async (req, res) => {
    const { id } = req.params;
    const service: CustomerService = req.scope.resolve("customerService")
    var result = await service.delete(id);
    res.status(200).json({ result })
  }))

  return router;
}


function generateRandomPassword() {
  var length = 8;
  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowercase = "abcdefghijklmnopqrstuvwxyz";
  var numbers = "0123456789";
  var specialChars = "!@#$%^&*()_+-=";

  var password = "";

  // Add at least one character from each category
  password += getRandomCharacter(uppercase);
  password += getRandomCharacter(lowercase);
  password += getRandomCharacter(numbers);
  password += getRandomCharacter(specialChars);

  // Add the remaining characters randomly
  var remainingLength = length - 4;
  for (var i = 0; i < remainingLength; i++) {
    var charset = uppercase + lowercase + numbers + specialChars;
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Shuffle the password characters
  password = shuffleString(password);

  return password;
}

// Helper function to get a random character from a string
function getRandomCharacter(string: string) {
  var randomIndex = Math.floor(Math.random() * string.length);
  return string[randomIndex];
}

// Helper function to shuffle the characters of a string
function shuffleString(string: string) {
  var array = string.split('');
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array.join('');
}
