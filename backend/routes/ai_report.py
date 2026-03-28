from fastapi import APIRouter
import google.generativeai as genai
import os
from database import run_query

router = APIRouter(prefix="/ai", tags=["AI Reports"])

@router.get("/report/{student_id}")
async def generate_ai_report(student_id: int):
    GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
    if not GEMINI_KEY:
        return {"error": "Gemini API key not configured"}

    student = run_query(
        "SELECT full_name, enrolled_year FROM students WHERE student_id=%s",
        (student_id,)
    )
    if not student:
        return {"error": "Student not found"}

    marks = run_query("""
        SELECT sub.subject_name, m.exam_type,
               m.marks_scored, sub.max_marks
        FROM marks m
        JOIN subjects sub ON m.subject_id = sub.subject_id
        WHERE m.student_id = %s
        ORDER BY sub.subject_name
    """, (student_id,))

    attendance = run_query("""
        SELECT sub.subject_name,
               ROUND(SUM(a.status='Present')*100.0/COUNT(*),1) AS attend_pct
        FROM attendance a
        JOIN subjects sub ON a.subject_id = sub.subject_id
        WHERE a.student_id = %s
        GROUP BY sub.subject_id
    """, (student_id,))

    avg = run_query(
        "SELECT ROUND(AVG(marks_scored),2) AS avg FROM marks WHERE student_id=%s",
        (student_id,)
    )

    marks_summary = "\n".join([
        f"  - {m['subject_name']} ({m['exam_type']}): {m['marks_scored']}/{m['max_marks']}"
        for m in marks
    ])
    attend_summary = "\n".join([
        f"  - {a['subject_name']}: {a['attend_pct']}%"
        for a in attendance
    ])

    prompt = f"""
You are an expert academic advisor. Based on the following student data,
write a concise 4-sentence performance report. Be encouraging but honest.
Mention their strongest subject, weakest subject, attendance concern if any,
and one specific actionable recommendation.

Student: {student[0]['full_name']}
Overall Average: {avg[0]['avg']}/100

Marks breakdown:
{marks_summary}

Attendance:
{attend_summary}

Write the report in a warm, professional tone. No bullet points — just 4 sentences.
"""

    try:
        genai.configure(api_key=GEMINI_KEY)
        model  = genai.GenerativeModel("gemini-2.5-flash")
        result = model.generate_content(prompt)
        ai_text = result.text
    except Exception as e:
        ai_text = f"Error: {str(e)}"

    return {
        "student_id":   student_id,
        "student_name": student[0]['full_name'],
        "avg_marks":    avg[0]['avg'],
        "ai_report":    ai_text
    }