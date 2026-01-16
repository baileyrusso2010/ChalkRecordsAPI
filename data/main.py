import psycopg2
import traceback
import random
import os
from dotenv import load_dotenv
from faker import Faker
import csv
from datetime import datetime, timedelta

load_dotenv()

# Global connection variable
connection = None
fake = Faker()

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
            district_name = fake.random_element(elements=["Aurora School District", "Boulder Valley School District", "Denver Public Schools"])
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
            school_name = fake.random_element(elements=["Aurora High", "Boulder High", "Denver East High"])
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
        district_id = 1
        with connection.cursor() as cursor:

            for i in range(num):
                last_name= fake.last_name()
                first_name = fake.first_name()
                staff_id = fake.random_number(digits=5)

                cursor.execute("INSERT INTO staff (staff_id, district_id, first_name, last_name) VALUES (%s, %s, %s, %s)", (staff_id, district_id, first_name, last_name))
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

            if not staff_ids or not term_ids or not school_ids:
                print("Missing prerequisites for courses (staff, terms, or schools).")
                return

            for i in range(num):
                alias = fake.random_element(elements=["Math", "Science", "English", "Social Studies", "History"])
                random_staff_id = fake.random_element(elements=staff_ids)
                random_term_id = fake.random_element(elements=term_ids)
                school_year_id = year_id
                random_school_id = fake.random_element(elements=school_ids)

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

                # Assign a realistic number of courses (e.g., 4 to 6), or all if fewer exist
                num_to_take = fake.random_int(min=4, max=6)
                num_to_take = min(num_to_take, len(available_courses))
                
                # Pick unique courses
                selected_courses = fake.random_elements(elements=available_courses, length=num_to_take, unique=True)

                for course_id, term_id in selected_courses:
                    enrollment_date = fake.date_time_between(start_date="-1y", end_date="now")
                    
                    cursor.execute("""
                        INSERT INTO enrollments 
                        (student_id, course_instance_id, term_id, enrollment_date, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, NOW(), NOW())
                        ON CONFLICT (student_id, course_instance_id, term_id) DO NOTHING
                    """, (student_id, course_id, term_id, enrollment_date))
                    enrollment_count += 1
            
            connection.commit()
            print(f"Enrollments created successfully! Total: {enrollment_count}")
    else:
        print("No database connection available.")

def create_term_grades():
    if connection: 
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM enrollments")
            enrollment_ids = [row[0] for row in cursor.fetchall()]

            cursor.execute("SELECT id FROM task")
            task_ids = [row[0] for row in cursor.fetchall()]

            for enrollment_id in enrollment_ids:
                for task_id in task_ids:
                    numeric_score = fake.random_int(min=0, max=100)
                    letter_grade = fake.random_element(elements=["A", "B", "C", "D", "F"])
                    pass_fail = fake.boolean(chance_of_getting_true=70)

                    cursor.execute("INSERT INTO student_term_grades (enrollment_id, task_id, numeric_score, letter_grade, pass_fail, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, NOW(), NOW())", (enrollment_id, task_id, numeric_score, letter_grade, pass_fail))
            connection.commit()
            print("Term grades created successfully!")
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

            print(f"Creating {num} students...")
            for i in range(num):
                first_name = fake.first_name()
                last_name = fake.last_name()
                student_id = fake.random_number(digits=5)
                gender = fake.random_element(elements=["Male", "Female", "Other"])
                #age can be random between 5 and 18
                age = fake.pyint(min_value=12, max_value=18)
                #grade can be random between 5 and 12
                grade = age - 6

                random_school_id = fake.random_element(elements=school_ids)
                
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
            existing_behaviors = set()
            cursor.execute("SELECT name FROM behavior_types")
            for row in cursor.fetchall():
                existing_behaviors.add(row[0])

            for b_name in behavior_types:
                if b_name not in existing_behaviors:
                    cursor.execute("INSERT INTO behavior_types (name) VALUES (%s)", (b_name,))
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
            target_students = fake.random_elements(elements=all_student_ids, length=num_bad_students, unique=True)

            print(f"Creating behavior records for {len(target_students)} students...")
            
            locations = ["Classroom", "Hallway", "Cafeteria", "Gym", "Bus", "Playground"]
            resolutions = ["Parent Contact", "Detention", "Suspension", "Counseling", "Warning"]

            count = 0
            for student_id in target_students:
                # 1 to 3 incidents per student
                for _ in range(fake.random_int(min=1, max=3)):
                    staff_id = fake.random_element(elements=all_staff_ids)
                    b_type_id = fake.random_element(elements=behavior_type_ids)
                    
                    incident_date = fake.date_time_between(start_date="-1y", end_date="now")
                    location = fake.random_element(elements=locations)
                    desc = fake.sentence()
                    res_name = fake.random_element(elements=resolutions)

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
            existing = set()
            cursor.execute("SELECT code FROM attendance_status")
            for row in cursor.fetchall():
                existing.add(row[0])

            for status in statuses:
                if status not in existing:
                    cursor.execute("INSERT INTO attendance_status (code) VALUES (%s)", (status,))
            connection.commit()

def create_attendance():
    if connection:
        with connection.cursor() as cursor:
            # Fetch Students
            cursor.execute("SELECT id, school_id FROM students")
            students = cursor.fetchall()
            
            # Fetch Attendance Statuses map
            cursor.execute("SELECT code, id FROM attendance_status")
            status_rows = cursor.fetchall()
            status_map = {row[0]: row[1] for row in status_rows}
            
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
            
            # Use Delete + Insert pattern to handle lack of Unique Constraints safely
            # Note: This deletes ALL attendance for the date range, so use with caution
            print("Clearing existing attendance for this range...")
            cursor.execute("DELETE FROM attendance_daily WHERE attendance_date >= %s AND attendance_date <= %s", (start_date, end_date))
            connection.commit()

            print("Generating records...")

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
            
            
            query = """
                INSERT INTO attendance_daily 
                (student_id, school_id, attendance_status_id, attendance_date, source, created_at, updated_at) 
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            """
            
            batch_size = 5000
            total_inserted = 0
            
            for i in range(0, len(records_to_insert), batch_size):
                batch = records_to_insert[i:i + batch_size]
                cursor.executemany(query, batch)
                connection.commit()
                total_inserted += len(batch)

            print(f"Attendance created successfully! Total records processed: {total_inserted}")
    else:
        print("No database connection available.")

def import_program_catalog():
    if connection:
        if not os.path.exists("./Program_Catalog.csv"):
            print("Program_Catalog.csv not found, skipping.")
            return

        with connection.cursor() as cursor:
            # Safe import: only insert if not exists
            cursor.execute("SELECT state_program_code FROM program_catalog")
            existing_codes = {row[0] for row in cursor.fetchall()}

            with open("./Program_Catalog.csv") as file:
                reader = csv.reader(file)
                next(reader)
                for row in reader:
                    state_program_code = row[1]
                    title = row[2]
                    if state_program_code not in existing_codes:
                        cursor.execute("INSERT INTO program_catalog (state_program_code, title) VALUES (%s, %s)", (state_program_code, title))
            connection.commit()
            print("Program catalog imported successfully!")

def create_wbl_types():
    if connection:
        with connection.cursor() as cursor:
            types = ["Internship", "Co-Op", "Job Shadow"]
            existing = set()
            cursor.execute("SELECT name FROM wbl_catagories")
            for row in cursor.fetchall():
                existing.add(row[0])

            for t in types:
                if t not in existing:
                    cursor.execute("INSERT INTO wbl_catagories (name) VALUES(%s)", (t,))
            connection.commit()
            print("WBL types created successfully!")

def import_course_catalog():
    if connection:
        if not os.path.exists("./Course_Catalog.csv"):
            print("Course_Catalog.csv not found, skipping.")
            return

        with connection.cursor() as cursor:
            cursor.execute("SELECT course_code FROM course_catalog")
            existing_codes = {row[0] for row in cursor.fetchall()}

            with open("./Course_Catalog.csv") as file:
                reader = csv.reader(file)
                next(reader)
                for row in reader:
                    course_code = row[1]
                    title = row[2]
                    if course_code not in existing_codes:
                        cursor.execute("INSERT INTO course_catalog (course_code, title) VALUES (%s, %s)", (course_code, title))
            connection.commit()
            print("Course catalog imported successfully!")

def create_risk_signals():
    if connection:
        with connection.cursor() as cursor:
            print("Generating Risk Signals...")
            
            # Clear existing signals
            cursor.execute("TRUNCATE student_risk_signals RESTART IDENTITY CASCADE;")

            # 1. Fetch Students
            cursor.execute("SELECT id FROM students")
            student_ids = [row[0] for row in cursor.fetchall()]

            # 2. Behavior Data
            # Map student_id -> incident_count
            cursor.execute("SELECT student_id, COUNT(*) FROM behavior GROUP BY student_id")
            behavior_counts = {row[0]: row[1] for row in cursor.fetchall()}

            # 3. Attendance Data
            # Map student_id -> {total: x, present: y}
            cursor.execute("SELECT id, code FROM attendance_status")
            status_map = {row[0]: row[1] for row in cursor.fetchall()} # ID -> Code

            cursor.execute("SELECT student_id, attendance_status_id, COUNT(*) FROM attendance_daily GROUP BY student_id, attendance_status_id")
            attendance_data = {}
            for sid, status_id, count in cursor.fetchall():
                if sid not in attendance_data:
                    attendance_data[sid] = {'total': 0, 'present': 0}
                
                attendance_data[sid]['total'] += count
                if status_map.get(status_id) == 'P':
                    attendance_data[sid]['present'] += count

            # 4. Grades Data
            # Map student_id -> avg_grade
            cursor.execute("""
                SELECT e.student_id, AVG(g.numeric_score) 
                FROM student_term_grades g 
                JOIN enrollments e ON g.enrollment_id = e.id 
                GROUP BY e.student_id
            """)
            grades_data = {row[0]: float(row[1]) for row in cursor.fetchall()}

            # Map student_id -> fail_count
            cursor.execute("""
                SELECT e.student_id, COUNT(*) 
                FROM student_term_grades g 
                JOIN enrollments e ON g.enrollment_id = e.id 
                WHERE g.pass_fail = false
                GROUP BY e.student_id
            """)
            failures_data = {row[0]: row[1] for row in cursor.fetchall()}

            # 5. Generate Signals
            signals_to_insert = []
            model_version = "v1.0"
            calculated_at = datetime.now()

            for sid in student_ids:
                # --- Behavior ---
                # Score: 100 - (5 per incident). Min 0.
                incidents = behavior_counts.get(sid, 0)
                beh_score = max(0, 100 - (incidents * 10)) 
                # Trend: Random for now, correlated with score
                beh_trend = 0
                if beh_score < 70: beh_trend = -1
                elif beh_score > 90: beh_trend = 1
                
                signals_to_insert.append((sid, 'Behavior', beh_score, beh_trend, model_version, calculated_at))

                # --- Attendance ---
                att_stats = attendance_data.get(sid, {'total': 0, 'present': 0})
                if att_stats['total'] > 0:
                    att_pct = (att_stats['present'] / att_stats['total']) * 100
                    att_score = int(att_pct)
                else:
                    att_score = 100 # No data = perfect?
                
                att_trend = 0
                if att_score < 85: att_trend = -1
                elif att_score > 95: att_trend = 1
                
                signals_to_insert.append((sid, 'Attendance', att_score, att_trend, model_version, calculated_at))

                # --- Grades ---
                # --- Grades ---
                grade_avg = grades_data.get(sid, None)
                fail_count = failures_data.get(sid, 0)

                if grade_avg is not None:
                    # Start with average, penalize for failures
                    base_score = int(grade_avg)
                    penalty = fail_count * 10
                    acad_score = max(0, base_score - penalty)
                else:
                    acad_score = 100 # Default
                
                acad_trend = 0
                if acad_score < 70: acad_trend = -1
                elif acad_score > 85: acad_trend = 1
                
                signals_to_insert.append((sid, 'Academics', acad_score, acad_trend, model_version, calculated_at))

            # Batch Insert
            batch_size = 5000
            query = """
                INSERT INTO student_risk_signals 
                (student_id, driver, score, trend, model_version, calculated_at) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            for i in range(0, len(signals_to_insert), batch_size):
                batch = signals_to_insert[i:i + batch_size]
                cursor.executemany(query, batch)
                connection.commit()

            print(f"Risk Signals created successfully! Total signals: {len(signals_to_insert)}")
    else:
        print("No database connection available.")

def mtss_tiers_and_domains():
    if connection:
        with connection.cursor() as cursor:
            tiers = ["Tier 1", "Tier 2", "Tier 3"]
            existing_tiers = set()
            cursor.execute("SELECT name FROM mtss_tiers")
            for row in cursor.fetchall():
                existing_tiers.add(row[0])
            
            for t in tiers:
                if t not in existing_tiers:
                    cursor.execute("INSERT INTO mtss_tiers (name) VALUES (%s)", (t,))
            
            domains = ["Behavior", "Academic", "Social-Emotional"]
            existing_domains = set()
            cursor.execute("SELECT name FROM mtss_domains")
            for row in cursor.fetchall():
                existing_domains.add(row[0])

            for d in domains:
                if d not in existing_domains:
                    cursor.execute("INSERT INTO mtss_domains (name) VALUES (%s)", (d,))
            
            connection.commit()
            print("MTSS tiers and domains created successfully!")

def generate_mtss_data():
    """Combined realistic generation for Student Tiers, Screenings, and Interventions."""
    if connection:
        with connection.cursor() as cursor:
            print("Generating Realistic MTSS Data...")
            
            # --- PREP DATA ---
            cursor.execute("SELECT id, name FROM mtss_tiers")
            tiers_map = {row[1]: row[0] for row in cursor.fetchall()} # {'Tier 1': 1, ...}
            
            cursor.execute("SELECT id, name FROM mtss_domains")
            domains_map = {row[1]: row[0] for row in cursor.fetchall()}
            
            cursor.execute("SELECT id FROM students")
            all_students = [row[0] for row in cursor.fetchall()]

            if not tiers_map or not domains_map or not all_students:
                print("Missing MTSS reference data.")
                return

            t1_id = tiers_map["Tier 1"]
            t2_id = tiers_map["Tier 2"]
            t3_id = tiers_map["Tier 3"]

            # Define Catalog Interventions (to be inserted into `interventions` table)
            # Structure: (Name, DomainName, TierName, Description)
            catalog_raw = [
                ("Check-in/Check-out", "Behavior", "Tier 2", "Daily progress report card"),
                ("Social Skills Group", "Social-Emotional", "Tier 2", "Weekly group session"),
                ("Reading Recovery", "Academic", "Tier 3", "Intensive 1:1 reading support"),
                ("Math Lab", "Academic", "Tier 2", "Extra math practice"),
                ("FBA/BIP", "Behavior", "Tier 3", "Functional Behavior Assessment"),
            ]
            
            catalog_ids = []
            
            # Create Interventions in DB
            for name, d_name, t_name, desc in catalog_raw:
                d_id = domains_map[d_name]
                t_id = tiers_map[t_name]
                # Try to find existing first
                cursor.execute("SELECT id FROM interventions WHERE name = %s AND domain_id = %s AND tier_id = %s", (name, d_id, t_id))
                res = cursor.fetchone()
                
                if not res:
                    cursor.execute("""
                        INSERT INTO interventions (name, domain_id, tier_id, description, frequency, duration)
                        VALUES (%s, %s, %s, %s, 'Weekly', '30 mins')
                        RETURNING id
                    """, (name, d_id, t_id, desc))
                    cat_id = cursor.fetchone()[0]
                else:
                    cat_id = res[0]
                    
                catalog_ids.append({'id': cat_id, 'domain_id': d_id, 'tier_id': t_id})

            connection.commit()


            # --- GENERATION LOGIC ---
            
            # 1. Default every student to Tier 1 in ALL domains
            today = datetime.now().date()
            start_of_year = today - timedelta(days=120)
            
            student_tier_inserts = []
            student_intervention_inserts = []
            screening_inserts = []

            for student_id in all_students:
                
                # For each Student, decide their profile
                # Roll for "Risk Status":
                # 80% - Healthy (Tier 1 across board)
                # 15% - At Risk (Tier 2 in one domain)
                # 5% - High Risk (Tier 3 in one or more domains)
                
                risk_roll = random.random()
                
                # Default Assignments (Tier 1)
                # We track which domains have been escalated so we don't double book
                escalated_domains = [] 
                
                risk_level = "T1"
                if risk_roll > 0.95:
                    risk_level = "T3"
                elif risk_roll > 0.80:
                    risk_level = "T2"

                # If T2 or T3, pick a primary concern domain
                primary_domain_name = random.choice(list(domains_map.keys()))
                primary_domain_id = domains_map[primary_domain_name]

                for d_name, d_id in domains_map.items():
                    current_tier_id = t1_id
                    
                    # Logic: If this is the primary concern domain AND risk level match
                    if d_name == primary_domain_name:
                        if risk_level == "T2":
                            current_tier_id = t2_id
                        elif risk_level == "T3":
                            current_tier_id = t3_id
                    
                    # Insert Tier Record
                    # If T1, simple. If T2/T3, we imply they started T1 earlier and moved up.
                    # For simplicity, we'll just put them in their CURRENT tier starting 30 days ago.
                    student_tier_inserts.append((student_id, current_tier_id, d_id, start_of_year))

                    # 2. Screenings
                    # Generate score based on Tier
                    # T1: 75-100, T2: 50-74, T3: 0-49
                    if current_tier_id == t1_id:
                        score = random.randint(75, 100)
                    elif current_tier_id == t2_id:
                        score = random.randint(50, 74)
                    else:
                        score = random.randint(20, 49)
                        
                    screening_date = today - timedelta(days=random.randint(0, 60))
                    screening_inserts.append((student_id, d_id, "Universal Screener", score, 60, screening_date))

                    # 3. Interventions
                    # Only assign if T2 or T3
                    if current_tier_id in [t2_id, t3_id]:
                        # Find matching interventions from catalog
                        possible_interventions = [i for i in catalog_ids if i['tier_id'] == current_tier_id and i['domain_id'] == d_id]
                        if possible_interventions:
                            chosen_int = random.choice(possible_interventions)
                            student_intervention_inserts.append((student_id, chosen_int['id'], start_of_year, "Active"))

            # --- BATCH INSERTS ---
            
            print(f"Assigning {len(student_tier_inserts)} tier placements...")
            cursor.executemany("INSERT INTO mtss_student_tiers (student_id, tier_id, domain_id, start_date) VALUES (%s, %s, %s, %s)", student_tier_inserts)

            print(f"Creating {len(screening_inserts)} screening records...")
            cursor.executemany("INSERT INTO screenings (student_id, domain_id, assessment_name, score, benchmark, screening_date) VALUES (%s, %s, %s, %s, %s, %s)", screening_inserts)
            
            print(f"Assigning {len(student_intervention_inserts)} active interventions...")
            cursor.executemany("INSERT INTO student_interventions (student_id, intervention_id, start_date, status) VALUES (%s, %s, %s, %s)", student_intervention_inserts)

            connection.commit()
            print("MTSS Data Generation Complete.")
    else:
        print("No database connection available.")

# Example usage
if __name__ == '__main__':
    connect_to_postgres()
    
    if connection:
        import_program_catalog()
        import_course_catalog()
        
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
            create_staff(20)

        # Ensure students exist
        with connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM students")
            student_count = cursor.fetchone()[0]

        if student_count < 50:
            print("Seeding students (aiming for 50+)...")
            create_students(50)
        
        # Helper calls
        create_course(15)
        create_enrollment()
        create_term_grades()
        create_behavior()
        create_attendance_statuses()
        create_attendance()
        create_wbl_types()
        
        # Risk Signals
        create_risk_signals()
        
        # MTSS
        mtss_tiers_and_domains()
        # Clear old MTSS data to prevent duplicates stacking on top of old bad data
        with connection.cursor() as cursor:
            print("Cleaning up old MTSS random data...")
            cursor.execute("TRUNCATE mtss_student_tiers, screenings, student_interventions, interventions RESTART IDENTITY CASCADE;")
            connection.commit()
            
        generate_mtss_data()

        create_risk_signals()

        connection.close()
        print("Connection closed.")
