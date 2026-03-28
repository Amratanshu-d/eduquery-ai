import mysql.connector
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pickle
import os

# ── Connect to MySQL and pull data ──────────────────────────
conn = mysql.connector.connect(
    host="localhost", user="root",
    password="Amratanshu@2106",        # ← change this
    database="eduquery_db"
)

query = """
    WITH avg_marks AS (
        SELECT student_id,
               ROUND(AVG(marks_scored), 2)         AS avg_marks,
               ROUND(MIN(marks_scored), 2)          AS min_marks,
               ROUND(MAX(marks_scored), 2)          AS max_marks,
               COUNT(DISTINCT subject_id)           AS subjects_attempted
        FROM marks
        GROUP BY student_id
    ),
    attend AS (
        SELECT student_id,
               ROUND(SUM(status='Present') * 100.0 / COUNT(*), 1) AS attend_pct,
               SUM(status='Absent')                                AS total_absences
        FROM attendance
        GROUP BY student_id
    )
    SELECT
        s.student_id,
        am.avg_marks,
        am.min_marks,
        am.max_marks,
        am.subjects_attempted,
        a.attend_pct,
        a.total_absences,
        CASE WHEN am.avg_marks < 50 AND a.attend_pct < 60
             THEN 1 ELSE 0 END        AS is_at_risk
    FROM students s
    JOIN avg_marks am ON s.student_id = am.student_id
    JOIN attend    a  ON s.student_id = a.student_id
"""

df = pd.read_sql(query, conn)
conn.close()

print(f"✅ Loaded {len(df)} students from MySQL")
print(f"   At-risk: {df['is_at_risk'].sum()} | Safe: {(df['is_at_risk']==0).sum()}")

# ── Features and label ──────────────────────────────────────
FEATURES = ['avg_marks','min_marks','max_marks',
            'subjects_attempted','attend_pct','total_absences']

X = df[FEATURES]
y = df['is_at_risk']

# ── Train / test split ──────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Train Random Forest ─────────────────────────────────────
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=5,
    random_state=42
)
model.fit(X_train, y_train)

# ── Evaluate ────────────────────────────────────────────────
y_pred = model.predict(X_test)
print(f"\n📊 Accuracy: {accuracy_score(y_test, y_pred) * 100:.1f}%")
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred,
      target_names=['Safe','At-Risk']))

# ── Feature importance ──────────────────────────────────────
print("\n🔍 Feature Importance:")
for feat, imp in sorted(zip(FEATURES, model.feature_importances_),
                         key=lambda x: x[1], reverse=True):
    bar = '█' * int(imp * 40)
    print(f"  {feat:<22} {bar} {imp:.3f}")

# ── Save model ──────────────────────────────────────────────
os.makedirs('../backend/ml_models', exist_ok=True)
with open('../backend/ml_models/risk_model.pkl', 'wb') as f:
    pickle.dump({'model': model, 'features': FEATURES}, f)

print("\n✅ Model saved to backend/ml_models/risk_model.pkl")