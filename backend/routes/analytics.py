from fastapi import APIRouter
from database import run_query

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# At-risk students (CTE query)
@router.get("/at-risk")
def get_at_risk_students():
    query = """
        WITH student_avg_marks AS (
            SELECT student_id,
                   ROUND(AVG(marks_scored), 2) AS avg_marks
            FROM marks
            GROUP BY student_id
        ),
        student_attendance AS (
            SELECT student_id,
                   ROUND(SUM(status = 'Present') * 100.0 / COUNT(*), 1) AS attend_pct
            FROM attendance
            GROUP BY student_id
        )
        SELECT
            s.student_id,
            s.full_name,
            sam.avg_marks,
            sa.attend_pct,
            'AT RISK' AS risk_flag
        FROM students s
        JOIN student_avg_marks sam ON s.student_id = sam.student_id
        JOIN student_attendance sa  ON s.student_id = sa.student_id
        WHERE sam.avg_marks < 50 AND sa.attend_pct < 60
        ORDER BY sam.avg_marks ASC
    """
    return run_query(query)

# Subject-wise pass/fail rate
@router.get("/subject-passrate")
def get_subject_passrate():
    query = """
        SELECT
            sub.subject_name,
            COUNT(DISTINCT m.student_id)                        AS total_students,
            SUM(m.marks_scored >= 40)                           AS passed,
            SUM(m.marks_scored < 40)                            AS failed,
            ROUND(SUM(m.marks_scored >= 40) * 100.0
                  / COUNT(DISTINCT m.student_id), 1)            AS pass_rate_pct
        FROM subjects sub
        JOIN marks m ON sub.subject_id = m.subject_id
        WHERE m.exam_type = 'Final'
        GROUP BY sub.subject_id
        ORDER BY pass_rate_pct ASC
    """
    return run_query(query)

# Student rankings with window function
@router.get("/rankings")
def get_rankings():
    query = """
        SELECT
            s.student_id,
            s.full_name,
            ROUND(AVG(m.marks_scored), 2) AS avg_marks,
            RANK() OVER (ORDER BY AVG(m.marks_scored) DESC) AS rank_overall,
            CASE
                WHEN AVG(m.marks_scored) >= 90 THEN 'A+'
                WHEN AVG(m.marks_scored) >= 75 THEN 'A'
                WHEN AVG(m.marks_scored) >= 60 THEN 'B'
                WHEN AVG(m.marks_scored) >= 45 THEN 'C'
                ELSE 'F'
            END AS grade
        FROM students s
        JOIN marks m ON s.student_id = m.student_id
        GROUP BY s.student_id, s.full_name
        ORDER BY avg_marks DESC
    """
    return run_query(query)

# Top performer per subject
@router.get("/top-performers")
def get_top_performers():
    query = """
        SELECT subject_name, full_name, avg_marks
        FROM (
            SELECT
                sub.subject_name,
                s.full_name,
                ROUND(AVG(m.marks_scored), 2) AS avg_marks,
                ROW_NUMBER() OVER (
                    PARTITION BY sub.subject_id
                    ORDER BY AVG(m.marks_scored) DESC
                ) AS rn
            FROM students s
            JOIN marks    m   ON s.student_id  = m.student_id
            JOIN subjects sub ON m.subject_id  = sub.subject_id
            GROUP BY sub.subject_id, s.student_id
        ) ranked
        WHERE rn = 1
    """
    return run_query(query)

# Dashboard summary counts
@router.get("/dashboard-summary")
def get_dashboard_summary():
    students  = run_query("SELECT COUNT(*) AS total FROM students")[0]["total"]
    at_risk   = run_query("""
        SELECT COUNT(*) AS total FROM (
            SELECT s.student_id
            FROM students s
            JOIN marks m ON s.student_id = m.student_id
            GROUP BY s.student_id
            HAVING AVG(m.marks_scored) < 50
        ) t
    """)[0]["total"]
    subjects  = run_query("SELECT COUNT(*) AS total FROM subjects")[0]["total"]
    avg_marks = run_query("SELECT ROUND(AVG(marks_scored),2) AS avg FROM marks")[0]["avg"]

    return {
        "total_students": students,
        "at_risk_count":  at_risk,
        "total_subjects": subjects,
        "overall_avg":    avg_marks
    }