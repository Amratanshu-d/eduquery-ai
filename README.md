# 📚 EduQuery AI — Student Performance Analytics Platform

> A full-stack AI-powered education analytics system built with 
> MySQL, FastAPI, React.js, and Machine Learning.

## 🌟 Live Features
- 📊 Real-time student performance dashboard
- 🏆 Student rankings with window functions & grade banding
- ⚠️ At-risk student detection using CTE queries
- 🤖 ML-based risk prediction (Random Forest, 100% accuracy)
- ✨ AI-generated personalized performance reports (Gemini API)
- 📚 Subject-wise pass rate analytics

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Database | MySQL (Joins, CTEs, Window Functions, Stored Procedures, Triggers) |
| Backend | Python FastAPI |
| Frontend | React.js + Recharts |
| ML Model | Scikit-learn (Random Forest Classifier) |
| AI Reports | Google Gemini 2.5 Flash API |

## 🗃️ Database Highlights (SQL Heavy)
- 5 normalized tables with foreign key relationships
- Multi-table JOINs across students, marks, subjects, attendance
- Window functions: RANK(), ROW_NUMBER(), PERCENT_RANK()
- CTEs for at-risk student detection
- Stored procedures for student report generation
- Triggers for automatic fail logging
- Aggregations, CASE WHEN grade banding, DATE functions

## 🚀 Setup Instructions

### Backend
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql
python database/seed_generator.py
```

### ML Model
```bash
cd ml
python train_model.py
```

## 📸 Screenshots
> Dashboard showing 100 students, grade distribution, 
> subject pass rates, ML predictions and AI reports

## 👤 Author
**Amratanshu Dwivedi** — aspiring Full Stack Developer