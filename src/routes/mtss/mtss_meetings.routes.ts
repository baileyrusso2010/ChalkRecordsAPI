import { Router } from "express"
import {
    createMeeting,
    listMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting,
} from "../../controller/mtss/mtss_meetings.controller"

const router = Router()

router.post("/", createMeeting)
router.get("/", listMeetings)
router.get("/:id", getMeeting)
router.put("/:id", updateMeeting)
router.delete("/:id", deleteMeeting)

export default router
