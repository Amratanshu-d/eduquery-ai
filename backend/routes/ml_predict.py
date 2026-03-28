from fastapi import APIRouter
import pickle
import os
from database import run_query

router = APIRouter(prefix="/ml", tags=["ML Predictions"])

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'ml_models', 'risk_model.pkl')
with open(MODEL_PATH, 'rb') as f:
    saved    = pickle.load(f)
    model    = saved['model']
    features = saved['features']

@router.get("/predict-all")
def predict_all_students():
    query = """
        WITH avg_marks AS (
            SELECT student_id,
                   ROUND(AVG(marks_scored), 2)                    AS avg_marks,
                   ROUND(MIN(marks_scored), 2)                    AS min_marks,
                   ROUND(MAX(marks_scored), 2)                    AS max_marks,
                   COUNT(DISTINCT subject_id)                     AS subjects_attempted
            FROM marks GROUP BY student_id
        ),
        attend AS (
            SELECT student_id,
                   ROUND(SUM(status='Present')*100.0/COUNT(*),1) AS attend_pct,
                   SUM(status='Absent')                           AS total_absences
            FROM attendance GROUP BY student_id
        )
        SELECT s.student_id, s.full_name,
               am.avg_marks, am.min_marks, am.max_marks,
               am.subjects_attempted, a.attend_pct, a.total_absences
        FROM students s
        JOIN avg_marks am ON s.student_id = am.student_id
        JOIN attend    a  ON s.student_id = a.student_id
    """
    rows = run_query(query)
    results = []
    for row in rows:
        vals = [[
            row['avg_marks'], row['min_marks'], row['max_marks'],
            row['subjects_attempted'], row['attend_pct'], row['total_absences']
        ]]
        prediction  = model.predict(vals)[0]
        probability = model.predict_proba(vals)[0][1]
        results.append({
            "student_id": row['student_id'],
            "full_name":  row['full_name'],
            "avg_marks":  row['avg_marks'],
            "attend_pct": row['attend_pct'],
            "is_at_risk": int(prediction),
            "risk_score": round(float(probability) * 100, 1),
            "risk_label": "HIGH RISK" if probability > 0.7
                          else "MEDIUM" if probability > 0.3
                          else "SAFE"
        })
    results.sort(key=lambda x: x['risk_score'], reverse=True)
    return results