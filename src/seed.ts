
import 'dotenv/config';
import { createCourseInstances, createEnrollments } from "./utils/fake_date";
import sequelize from "./database";

async function runSeed() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Sync models if needed
        await sequelize.sync({ alter: true }); 
        
        console.log("Starting Seed Process...");
        
        console.log("Creating Course Instances...");
        await createCourseInstances(10);
        
        console.log("Creating Enrollments...");
        await createEnrollments(20);
        
        console.log("Seed Completed Successfully.");
    } catch (error: any) {
        console.error('Data Seed Error:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

runSeed();
