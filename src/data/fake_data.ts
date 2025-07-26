import { Student } from "../models/student.model";
import { CTESchool } from "../models/cte_school.model";
import { SchoolDistricts } from "../models/school_district.model";
import { Program } from "../models/program.model";
import { Class } from "../models/classes.model";
import { Staff } from "../models/staff.model";
import { faker } from "@faker-js/faker";

export async function generateCTESchoolData() {
  await CTESchool.bulkCreate([
    {
      name: "CTE School A",
    },
    { name: "CTE School B" },
  ])
    .then(() => {
      console.log("CTE Schools created successfully.");
    })
    .catch((error) => {
      console.error("Error creating CTE Schools:", error);
    });
}

export async function generateSchoolDistrictData() {
  await SchoolDistricts.bulkCreate([
    {
      name: "District A",
      abbreviation: "DA",
    },
    {
      name: "District B",
      abbreviation: "DB",
    },
  ])
    .then(() => {
      console.log("School Districts created successfully.");
    })
    .catch((error) => {
      console.error("Error creating School Districts:", error);
    });
}

export async function generateProgramData() {
  await Program.bulkCreate([
    {
      name: "Welding",
    },
    {
      name: "Culinary Arts",
    },
    {
      name: "Information Technology",
    },
  ])
    .then(() => {
      console.log("Programs created successfully.");
    })
    .catch((error) => {
      console.error("Error creating Programs:", error);
    });
}

export async function generateStaffData() {
  try {
    await Staff.bulkCreate([
      {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        cte_schoolId: 1, // Assuming CTE School A has ID 1
        role: "Instructor",
        start_date: faker.date.past(),
        end_date: faker.date.future(),
      },
      {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        cte_schoolId: 2, // Assuming CTE School B has ID 2
        role: "Counselor",
        start_date: faker.date.past(),
        end_date: faker.date.future(),
      },
    ]);
    console.log("Staff members created successfully.");
  } catch (error: any) {
    console.error("Error creating Staff members:", error);
  }
}

export async function generateClassData() {
  try {
    await Class.bulkCreate([
      {
        name: "Advanced Welding",
        programId: 1, // Assuming Welding program has ID 1
        cte_schoolId: 1, // Assuming CTE School A has ID 1
        teacherId: 1, // Assuming Staff member with ID 1 is the teacher
      },
      {
        name: "Culinary Basics",
        programId: 2, // Assuming Culinary Arts program has ID 2
        cte_schoolId: 2, // Assuming CTE School B has ID 2
        teacherId: 2, // Assuming Staff member with ID 2 is the teacher
      },
    ]);
    console.log("Classes created successfully.");
  } catch (error: any) {
    console.error("Error creating Classes:", error);
  }
}

export async function generateStudentData() {
  try {
    await Student.bulkCreate([
      {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        student_id: faker.string.numeric(8),
        gender: faker.person.gender(),
        dateOfBirth: faker.date.birthdate({ min: 15, max: 18, mode: "age" }),
        email: faker.internet.email(),
        grade: faker.string.numeric(1), // Assuming grades are 9-12
        race: "white",
        hispanic: faker.datatype.boolean(),
        counslorId: 1, // Assuming Staff member with ID 1 is the counselor
        cteSchoolId: 1, // Assuming CTE School A has ID 1
        schoolDistrictId: 1, // Assuming District A has ID 1
      },
    ]);
    console.log("Students created successfully.");
  } catch (error: any) {
    console.error("Error creating Students:", error);
  }
}
