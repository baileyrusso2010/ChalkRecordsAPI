
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    connection = psycopg2.connect(
        dbname=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = connection.cursor()
    cursor.execute("SELECT count(*) FROM school")
    count = cursor.fetchone()[0]
    print(f"School count: {count}")
    
    cursor.execute("SELECT count(*) FROM district")
    district_count = cursor.fetchone()[0]
    print(f"District count: {district_count}")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if connection:
        connection.close()
