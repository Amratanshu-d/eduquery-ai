import mysql.connector
import random
from datetime import date, timedelta

conn = mysql.connector.connect(
    host="localhost", user="root",
    password="Amratanshu@2106",   # ← change this
    database="eduquery_db"
)
cursor = conn.cursor()

first_names = ["Aarav","Meera","Rohan","Sneha","Karan","Priya","Arjun","Divya",
               "Nikhil","Pooja","Rahul","Anjali","Vivek","Nisha","Amit","Riya",
               "Suresh","Deepa","Manoj","Kavita","Raj","Simran","Dev","Shreya"]
last_names  = ["Sharma","Patel","Verma","Iyer","Malhotra","Nair","Desai","Rao",
               "Joshi","Kulkarni","Kumar","Singh","Gupta","Mehta","Kapoor","Shah"]

def rand_date(start_year=2002, end_year=2004):
    start = date(start_year, 1, 1)
    end   = date(end_year, 12, 31)
    return start + timedelta(days=random.randint(0, (end - start).days))

# Insert 100 students (skip IDs 1-20 already inserted)
for i in range(80):
    name   = f"{random.choice(first_names)} {random.choice(last_names)}"
    email  = f"student{i+21}@student.com"
    gender = random.choice(['Male', 'Female'])
    dob    = rand_date()
    year   = random.choice([2022, 2023])
    cursor.execute(
        "INSERT IGNORE INTO students (full_name,email,gender,dob,enrolled_year) VALUES (%s,%s,%s,%s,%s)",
        (name, email, gender, dob, year)
    )

conn.commit()

# Fetch all student IDs
cursor.execute("SELECT student_id FROM students")
student_ids = [r[0] for r in cursor.fetchall()]

# Insert marks for all students, all 5 subjects
exam_types = ['Midterm', 'Final', 'Assignment']
exam_dates = [date(2023,3,15), date(2023,6,10), date(2023,4,1)]

for sid in student_ids:
    for subj_id in range(1, 6):
        for idx, etype in enumerate(exam_types):
            # At-risk students score lower (student_id divisible by 5)
            if sid % 5 == 0:
                score = random.randint(25, 50)
            else:
                score = random.randint(55, 98)
            cursor.execute(
                "INSERT IGNORE INTO marks (student_id,subject_id,exam_type,marks_scored,exam_date) VALUES (%s,%s,%s,%s,%s)",
                (sid, subj_id, etype, score, exam_dates[idx])
            )

# Insert attendance for all students
all_dates = [date(2023,1,10) + timedelta(days=i*2) for i in range(30)]
for sid in student_ids:
    for subj_id in range(1, 6):
        for adate in all_dates:
            if sid % 5 == 0:
                status = random.choices(['Present','Absent','Late'], weights=[40,45,15])[0]
            else:
                status = random.choices(['Present','Absent','Late'], weights=[80,10,10])[0]
            cursor.execute(
                "INSERT IGNORE INTO attendance (student_id,subject_id,attendance_date,status) VALUES (%s,%s,%s,%s)",
                (sid, subj_id, adate, status)
            )

conn.commit()
cursor.close()
conn.close()
print("✅ 100 students seeded with marks and attendance!")