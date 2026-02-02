import cteDistrictProgramRouter from "./cte/cte_district_program.routes"
import programCatalogRouter from "./program/program_catalog.routes"
import courseCatalogRouter from "./course/course_catalog.routes"
import courseInstanceRouter from "./course/course_instance.routes"
import districtRouter from "./school/district.routes"
import schoolRouter from "./school/school.routes"
import wblCategoriesRouter from "./wbl/wbl_catagories.routes"
import wblStudentsRouter from "./wbl/wbl_students.routes"
import studentRouter from "./student/student.routes"
import staffRouter from "./staff/staff.routes"
import skillRouter from "./skill/skill.routes"
import gradingRouter from "./gradebook/gradebook.routes"
import formRouter from "./forms/form.routes"
import assessmentRouter from "./assessments/assessment.routes"
import metricRotuer from "./common/metric.routes"
import behaviorRouter from "./behavior/behavior.routes"
import attendanceRouter from "./attendance/attendance.routes"
import rubricRouter from "./rubric/rubric.routes"
import permissionsRouter from "./permissions.routes"
import rolesRouter from "./roles.routes"

import mtssDomainsRouter from "./mtss/mtss_domains.routes"
import mtssTiersRouter from "./mtss/mtss_tiers.routes"
import mtssStudentTiersRouter from "./mtss/mtss_student_tiers.routes"
import screeningsRouter from "./mtss/screenings.routes"
import interventionsRouter from "./mtss/interventions.routes"
import studentInterventionsRouter from "./mtss/student_interventions.routes"
import progressMonitoringRouter from "./mtss/progress_monitoring.routes"
import mtssMeetingsRouter from "./mtss/mtss_meetings.routes"
import mtssDecisionsRouter from "./mtss/mtss_decisions.routes"
import referralsRouter from "./mtss/referrals.routes"
import mtssTimelineRouter from "./mtss/mtss_timeline.routes"

export const routes = [
    { path: "/api/evaluations", router: formRouter },
    { path: "/api/behaviors", router: behaviorRouter },
    { path: "/api/attendance", router: attendanceRouter },
    { path: "/api/cte-district-programs", router: cteDistrictProgramRouter },
    { path: "/api/program-catalogs", router: programCatalogRouter },
    { path: "/api/course-catalogs", router: courseCatalogRouter },
    { path: "/api/course-instances", router: courseInstanceRouter },
    { path: "/api/districts", router: districtRouter },
    { path: "/api/schools", router: schoolRouter },
    { path: "/api/wbl-categories", router: wblCategoriesRouter },
    { path: "/api/wbl-students", router: wblStudentsRouter },
    { path: "/api/students", router: studentRouter },
    { path: "/api/staff", router: staffRouter },
    { path: "/api/skill", router: skillRouter },
    { path: "/api/gradebook", router: gradingRouter },
    { path: "/api/metric", router: metricRotuer },
    { path: "/api/assessment", router: assessmentRouter },
    { path: "/api/rubrics", router: rubricRouter },
    { path: "/api/mtss/domains", router: mtssDomainsRouter },
    { path: "/api/mtss/tiers", router: mtssTiersRouter },
    { path: "/api/mtss/student-tiers", router: mtssStudentTiersRouter },
    { path: "/api/mtss/screenings", router: screeningsRouter },
    { path: "/api/mtss/interventions", router: interventionsRouter },
    { path: "/api/mtss/student-interventions", router: studentInterventionsRouter },
    { path: "/api/mtss/progress-monitoring", router: progressMonitoringRouter },
    { path: "/api/mtss/meetings", router: mtssMeetingsRouter },
    { path: "/api/mtss/decisions", router: mtssDecisionsRouter },
    { path: "/api/mtss/referrals", router: referralsRouter },
    { path: "/api/permissions", router: permissionsRouter },
    { path: "/api/roles", router: rolesRouter },
    { path: "/api/mtss", router: mtssTimelineRouter },
]
