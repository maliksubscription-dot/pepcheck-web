import { Router, type IRouter } from "express";
import healthRouter from "./health";
import providersRouter from "./providers";
import reviewsRouter from "./reviews";
import medicationsRouter from "./medications";
import statesRouter from "./states";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(providersRouter);
router.use(reviewsRouter);
router.use(medicationsRouter);
router.use(statesRouter);
router.use(statsRouter);

export default router;
