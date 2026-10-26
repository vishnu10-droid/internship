import { Router } from "express";
import {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
} from "../controllers/recordController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/:collection", listRecords);
router.post("/:collection", createRecord);
router.patch("/:collection/:id", updateRecord);
router.delete("/:collection/:id", deleteRecord);

export default router;
