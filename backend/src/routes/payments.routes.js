/* // backend/src/routes/payments.routes.js */

import express from "express"
import { createCheckoutSession } from "../controllers/payments.controller.js"

const router = express.Router();

router.post("/checkout/:id", createCheckoutSession);

export default router;