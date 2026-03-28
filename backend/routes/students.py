from fastapi import APIRouter, HTTPException
from database import run_query
from models import StudentCreate

router = APIRouter(prefix="/students", tags=["Students"])

# GET all students with their avg marks
@router.get("/")
def get_all_students():
    query = """
        SELECT
            s.student_id,
            s.full_name,
            s.email,
            s.gender,
            s.enrolled_year,
            ROUND(AVG(m.marks_scored), 2) AS avg_marks,
            COUNT(DISTINCT m.subject_id)  AS subjects_taken
        FROM students s
        LEFT JOIN marks m ON s.student_id = m.student_id
        GROUP BY s.student_id
        ORDER BY avg_marks DESC
    """
    return run_query(query)

# GET single student full report (calls stored procedure)
@router.get("/{student_id}/report")
def get_student_report(student_id: int):
    query = """
        SELECT
            s.full_name, s.email,
            sub.subject_name,
            m.exam_type,
            m.marks_scored,
            ROUND(m.marks_scored * 100.0 / sub.max_marks, 1) AS score_pct
        FROM students s
        JOIN marks    m   ON s.student_id  = m.student_id
        JOIN subjects sub ON m.subject_id  = sub.subject_id
        WHERE s.student_id = %s
        ORDER BY sub.subject_name, m.exam_type
    """
    result = run_query(query, (student_id,))
    if not result:
        raise HTTPException(status_code=404, detail="Student not found")
    return result

# GET student attendance summary
@router.get("/{student_id}/attendance")
def get_student_attendance(student_id: int):
    query = """
        SELECT
            sub.subject_name,
            COUNT(*)                                          AS total_classes,
            SUM(a.status = 'Present')                        AS present,
            SUM(a.status = 'Absent')                         AS absent,
            ROUND(SUM(a.status = 'Present') * 100.0
                  / COUNT(*), 1)                             AS attendance_pct
        FROM attendance a
        JOIN subjects sub ON a.subject_id = sub.subject_id
        WHERE a.student_id = %s
        GROUP BY sub.subject_id
    """
    return run_query(query, (student_id,))

# POST add new student
@router.post("/")
def create_student(student: StudentCreate):
    query = """
        INSERT INTO students (full_name, email, gender, dob, enrolled_year)
        VALUES (%s, %s, %s, %s, %s)
    """
    run_query(
        query,
        (student.full_name, student.email,
         student.gender, student.dob, student.enrolled_year),
        fetch=False
    )
    return {"message": "Student created successfully"}