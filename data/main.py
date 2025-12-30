import psycopg2
import traceback
import os
from dotenv import load_dotenv
from faker import Faker
import csv
from datetime import datetime, timedelta

load_dotenv()

# Global connection variable
connection = None

def connect_to_postgres():
    """Connect to a PostgreSQL database and update the global connection object."""
    global connection
    try:
        connection = psycopg2.connect(
            dbname=os.getenv("DB_DATABASE"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        print("Connection successful!")
            
    except (Exception, psycopg2.DatabaseError) as error:
        print("An error occurred while connecting to the database:")
        print(traceback.format_exc())

def create_district():
    """Create a new district in the database."""
    if connection:
        with connection.cursor() as cursor:
            #want array of district names 
            district_name = Faker().random_element(elements=["Auroa School District", "Boulder Valley School District", "Boulder School District"])
            cursor.execute("INSERT INTO district (name) VALUES (%s) RETURNING id", (district_name,))
            district_id = cursor.fetchone()[0]
            connection.commit()
            print(f"District created successfully! ID: {district_id}")

            return district_id
    else:
        print("No database connection available.")

def create_school(district_id):
    if connection:
        with connection.cursor() as cursor:
            school_name = Faker().random_element(elements=["Auroa School", "Boulder Valley School", "Boulder School"])
            cursor.execute("INSERT INTO school (district_id, name) VALUES (%s, %s)", (district_id, school_name))
            connection.commit()
            print("School created successfully!")
    else:
        print("No database connection available.")

def create_school_year(district_id):
    if connection:
        with connection.cursor() as cursor:

            label = "2025-2026"
            start_date = "2025-08-01"
            end_date = "2026-05-31"
            #might have to change district_id to school
            cursor.execute("INSERT INTO school_year (district_id, start_date, end_date,label) VALUES (%s, %s, %s, %s) RETURNING id", (district_id, start_date, end_date, label))
            school_year_id = cursor.fetchone()[0] 
            connection.commit()
            print("School year created successfully!")
            return school_year_id
    else:
        print("No database connection available.")

def create_term(school_year_id):
    if connection:
        with connection.cursor() as cursor:
            start_date = "2025-08-01"
            end_date = "2025-12-18"
            cursor.execute("INSERT INTO term (school_year_id, name, start_date, end_date) VALUES (%s, %s, %s, %s) RETURNING id", (school_year_id, "Q1", start_date, end_date))
            term_id = cursor.fetchone()[0] 
            connection.commit()
            print("Term created successfully!")
            return term_id
    else:
        print("No database connection available.")

def create_task(term_id):
    if connection:
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO task (term_id, name) VALUES (%s, %s) RETURNING id", (term_id, "Interim"))
            cursor.execute("INSERT INTO task (term_id, name) VALUES (%s, %s) RETURNING id", (term_id, "Quarter"))
            connection.commit()
            print("Task created successfully!")
    else:
        print("No database connection available.")

def create_staff(num):
    if connection:
        with connection.cursor() as cursor:

            for i in range(num):
                last_name= Faker().last_name()
                first_name = Faker().first_name()
                staff_id = Faker().random_number(digits=5)

                cursor.execute("INSERT INTO staff (staff_id, first_name, last_name) VALUES (%s, %s, %s)", (staff_id, first_name, last_name))
            connection.commit()
            print("Staff created successfully!")
    else:
        print("No database connection available.")

def create_course(num):
    if connection:


        with connection.cursor() as cursor:
            # list of staff
            cursor.execute("SELECT id FROM staff")
            staff_ids = [row[0] for row in cursor.fetchall()]

            # list of terms
            cursor.execute("SELECT id FROM term")
            term_ids = [row[0] for row in cursor.fetchall()]

            # one entry school year
            cursor.execute("SELECT id FROM school_year LIMIT 1")
            year_id = cursor.fetchone()[0]

            cursor.execute("SELECT id FROM school")
            school_ids = [row[0] for row in cursor.fetchall()]

            for i in range(num):
                alias = Faker().random_element(elements=["Math", "Science", "English", "Social Studies", "History"])
                random_staff_id = Faker().random_element(elements=staff_ids)
                random_term_id = Faker().random_element(elements=term_ids)
                school_year_id = year_id
                random_school_id = Faker().random_element(elements=school_ids)

                cursor.execute("INSERT INTO course_instance (alias, term_id, school_year_id, school_id) VALUES (%s, %s, %s, %s) RETURNING id", (alias, random_term_id, school_year_id, random_school_id))
                course_id = cursor.fetchone()[0] 
                connection.commit()

                cursor.execute("INSERT INTO course_instructors (course_instance_id, staff_id) VALUES (%s, %s)", (course_id, random_staff_id))
            connection.commit()
            print("Course created successfully!")
    else:
        print("No database connection available.")
    
def create_enrollment():
    if connection:
        with connection.cursor() as cursor:
            # 1. Fetch Students with their School ID
            cursor.execute("SELECT id, school_id FROM students")
            students = cursor.fetchall()

            # 2. Fetch Courses with their School ID and Term ID
            cursor.execute("SELECT id, school_id, term_id FROM course_instance")
            courses = cursor.fetchall()

            # 3. Group courses by school
            courses_by_school = {}
            for c_id, s_id, t_id in courses:
                if s_id not in courses_by_school:
                    courses_by_school[s_id] = []
                courses_by_school[s_id].append((c_id, t_id))

            print(f"Creating enrollments for {len(students)} students...")
            
            enrollment_count = 0
            for student_id, school_id in students:
                # Get courses available at this student's school
                available_courses = courses_by_school.get(school_id, [])
                
                if not available_courses:
                    continue

                # Assign a realistic number of courses (e.g., 4 to 8), or all if fewer exist
                num_to_take = Faker().random_int(min=4, max=8)
                num_to_take = min(num_to_take, len(available_courses))
                
                # Pick unique courses
                selected_courses = Faker().random_elements(elements=available_courses, length=num_to_take, unique=True)

                for course_id, term_id in selected_courses:
                    enrollment_date = Faker().date_time_between(start_date="-1y", end_date="now")
                    
                    cursor.execute("""
                        INSERT INTO enrollments 
                        (student_id, course_instance_id, term_id, enrollment_date, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, NOW(), NOW())
                    """, (student_id, course_id, term_id, enrollment_date))
                    enrollment_count += 1
            
            connection.commit()
            print(f"Enrollments created successfully! Total: {enrollment_count}")
    else:
        print("No database connection available.")

def create_students(num):
    if connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM school")
            school_ids = [row[0] for row in cursor.fetchall()]

            if not school_ids:
                print("No schools found in the database. Please create a school first.")
                return

            for i in range(num):
                first_name = Faker().first_name()
                last_name = Faker().last_name()
                student_id = Faker().random_number(digits=5)
                gender = Faker().random_element(elements=["Male", "Female", "Other"])
                #age can be random between 5 and 18
                age = Faker().pyint(min_value=12, max_value=18)
                #grade can be random between 5 and 12
                grade = age - 6

                random_school_id = Faker().random_element(elements=school_ids)
                
                cursor.execute("INSERT INTO students (student_id, first_name, last_name, gender, age, grade, school_id) VALUES (%s, %s, %s, %s, %s, %s, %s)", (student_id, first_name, last_name, gender, age, grade, random_school_id))
            connection.commit()
            print("Students created successfully!")
    else:
        print("No database connection available.")

def create_behavior():
    if connection:
        with connection.cursor() as cursor:
            # 1. Insert/Ensure Behavior Types
            behavior_types = ["Disruptive Behavior", "Fighting", "Verbal Disruptive Behavior", "Bullying", "Vandalism"]
            # We insert and ignore duplicates if possible, or just insert. 
            # For simplicity in this filler script, we'll try to insert and if it fails (unique constraint), we carry on.
            # A safer way specifically for this script's flow is to just insert them if table is empty or just select existing.
            # Let's insert blindly but use ON CONFLICT DO NOTHING clause if this is Postgres (which it is)
            for b_name in behavior_types:
                cursor.execute("INSERT INTO behavior_types (name) VALUES (%s) ON CONFLICT DO NOTHING", (b_name,))
            connection.commit()

            # 2. Get IDs necessary for generation
            cursor.execute("SELECT id FROM behavior_types")
            behavior_type_ids = [row[0] for row in cursor.fetchall()]

            cursor.execute("SELECT id FROM students")
            all_student_ids = [row[0] for row in cursor.fetchall()]

            cursor.execute("SELECT id FROM staff")
            all_staff_ids = [row[0] for row in cursor.fetchall()]
            
            if not behavior_type_ids or not all_student_ids or not all_staff_ids:
                print("Skipping behavior creation: Missing reference data.")
                return

            # 3. Select unique subset of students (e.g., ~15% of population)
            num_bad_students = max(1, int(len(all_student_ids) * 0.15))
            target_students = Faker().random_elements(elements=all_student_ids, length=num_bad_students, unique=True)

            print(f"Creating behavior records for {len(target_students)} students...")
            
            locations = ["Classroom", "Hallway", "Cafeteria", "Gym", "Bus", "Playground"]
            resolutions = ["Parent Contact", "Detention", "Suspension", "Counseling", "Warning"]

            count = 0
            for student_id in target_students:
                # 1 to 3 incidents per student
                for _ in range(Faker().random_int(min=1, max=3)):
                    staff_id = Faker().random_element(elements=all_staff_ids)
                    b_type_id = Faker().random_element(elements=behavior_type_ids)
                    
                    incident_date = Faker().date_time_between(start_date="-1y", end_date="now")
                    location = Faker().random_element(elements=locations)
                    desc = Faker().sentence()
                    res_name = Faker().random_element(elements=resolutions)

                    cursor.execute("""
                        INSERT INTO behavior 
                        (student_id, staff_id, behavior_type_id, date, location, event_description, resolution_name) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (student_id, staff_id, b_type_id, incident_date, location, desc, res_name))
                    count += 1
            
            connection.commit()
            print(f"Behavior created successfully! Total incidents: {count}")
    else:
        print("No database connection available.")

def create_attendance_statuses():
    if connection:
        with connection.cursor() as cursor:

            statuses = ["P", "A", "T"]

            for status in statuses:
                cursor.execute("INSERT INTO attendance_status (code) VALUES (%s)", (status,))
            connection.commit()

def create_attendance():
    if connection:
        with connection.cursor() as cursor:
            fake = Faker()
            
            # Fetch Students
            cursor.execute("SELECT id, school_id FROM students")
            students = cursor.fetchall()
            
            # Fetch Attendance Statuses map
            cursor.execute("SELECT code, id FROM attendance_status")
            status_rows = cursor.fetchall()
            status_map = {row[0]: row[1] for row in status_rows}
            
            # Create statuses if they don't exist
            if not status_map:
                create_attendance_statuses()
                cursor.execute("SELECT code, id FROM attendance_status")
                status_map = {row[0]: row[1] for row in cursor.fetchall()}
            
            status_ids_list = list(status_map.values())
            
            # Fetch Term dates
            cursor.execute("SELECT start_date, end_date FROM term LIMIT 1")
            term_data = cursor.fetchone()
            
            if not term_data:
                print("No term found, using default date range.")
                start_date = datetime(2025, 8, 1).date()
                end_date = datetime(2025, 12, 18).date()
            else:
                start_date = term_data[0]
                end_date = term_data[1]
                
            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            if isinstance(end_date, str):
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
            print(f"Generating attendance from {start_date} to {end_date} for {len(students)} students...")
            
            records_to_insert = []
            
            p_id = status_map.get('P')
            a_id = status_map.get('A')
            t_id = status_map.get('T')
            
            current_date = start_date
            while current_date <= end_date:
                if current_date.weekday() < 5: 
                    formatted_date = current_date.isoformat()
                    
                    for student_id, school_id in students:
                        # Logic: 90% Present, 5% Absent, 5% Tardy
                        if p_id and a_id and t_id:
                            rand_val = fake.random_int(min=1, max=100)
                            if rand_val <= 90:
                                status_id = p_id
                            elif rand_val <= 95:
                                status_id = a_id
                            else:
                                status_id = t_id
                        else:
                            status_id = fake.random_element(elements=status_ids_list)
                        
                        records_to_insert.append((student_id, school_id, status_id, formatted_date, 'manual'))
                        
                current_date += timedelta(days=1)
            
            print(f"Inserting {len(records_to_insert)} attendance records...")
            
            batch_size = 5000
            total_inserted = 0
            
            query = """
                INSERT INTO attendance_daily 
                (student_id, school_id, attendance_status_id, attendance_date, source, created_at, updated_at) 
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
                ON CONFLICT (student_id, attendance_date) DO NOTHING
            """
            
            for i in range(0, len(records_to_insert), batch_size):
                batch = records_to_insert[i:i + batch_size]
                cursor.executemany(query, batch)
                connection.commit()
                total_inserted += len(batch)
                print(f"Inserted batch {i // batch_size + 1}...")

            print(f"Attendance created successfully! Total records processed: {total_inserted}")
    else:
        print("No database connection available.")
def import_program_catalog():

    if connection:
        with connection.cursor() as cursor:
            with open("./Program_Catalog.csv") as file:
                reader = csv.reader(file)
                next(reader)
                for row in reader:
                    state_program_code = row[1]
                    title = row[2]
                    cursor.execute("INSERT INTO program_catalog (state_program_code, title) VALUES (%s, %s)", (state_program_code, title))
            connection.commit()
            print("Program catalog imported successfully!")
    else:
        print("No database connection available.")


def import_course_catalog():

    if connection:
        with connection.cursor() as cursor:
            with open("./Course_Catalog.csv") as file:
                reader = csv.reader(file)
                next(reader)
                for row in reader:
                    course_code = row[1]
                    title = row[2]
                    cursor.execute("INSERT INTO course_catalog (course_code, title) VALUES (%s, %s)", (course_code, title))
            connection.commit()
            print("Course catalog imported successfully!")
    else:
        print("No database connection available.")

# Example usage
if __name__ == '__main__':
    connect_to_postgres()
    
    if connection:
        # import_program_catalog()
        # import_course_catalog()
        
        # Check if we need to seed data (basic check based on school existence)
        with connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM school")
            count = cursor.fetchone()[0]
        
        if count == 0:
            print("Seeding initial data...")
            district_id = create_district()        
            create_school(district_id)
            school_year_id = create_school_year(district_id)
            term_id = create_term(school_year_id)
            create_task(term_id)
        else:
            print("Initial data (Schools, etc) already exists. Skipping creation.")

        # Ensure staff exists
        with connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM staff")
            staff_count = cursor.fetchone()[0]
        
        if staff_count == 0:
            print("Seeding staff...")
            create_staff(10)

        create_students(10)
        # create_course(10)
        # create_enrollment()
        create_behavior()

        # create_attendance_statuses()
        # create_attendance()

        connection.close()
        print("Connection closed.")
