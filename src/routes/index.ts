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
import pdfRouter from "./common/pdf.routes"
import gradingRouter from "./gradebook/gradebook.routes"
import formroutes from "./forms/form.routes"
import staticRoutes from "./forms/static_field.routes"
import rubricRoutes from "./forms/rubric_routes.routes"
import classFormAssignmentRouter from "./forms/class_form_assignment.routes"
import assessmentRouter from "./assessments/assessment.routes"
import metricRotuer from "./common/metric.routes"

export const routes = [
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
    { path: "/api/pdf", router: pdfRouter },
    { path: "/api/gradebook", router: gradingRouter },
    { path: "/api/metric", router: metricRotuer },
    { path: "/api/forms", router: formroutes },
    { path: "/api/static-fields", router: staticRoutes },
    { path: "/api/rubric", router: rubricRoutes },
    { path: "/api/class-form-assignments", router: classFormAssignmentRouter },
    { path: "/api/assessment", router: assessmentRouter },
]
