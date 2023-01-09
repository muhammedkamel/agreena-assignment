import { RequestHandler, Router } from "express";
import { auth } from "middlewares/auth.middleware";
import { FarmsController } from "modules/farms/farms.controller";


const router = Router();

router.use(auth)

const farmsController = new FarmsController();

router.post("/", farmsController.create.bind(farmsController) as RequestHandler);
router.put("/:id", farmsController.update.bind(farmsController) as RequestHandler);
router.delete("/:id", farmsController.delete.bind(farmsController) as RequestHandler);
// router.get("/", farmsController.get as RequestHandler);

export default router;
