from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.students  import router as students_router
from routes.analytics import router as analytics_router
from routes.auth      import router as auth_router
from routes.ml_predict import router as ml_router      # ← ADD THIS
from routes.ai_report  import router as ai_router      # ← ADD THIS

app = FastAPI(
    title="EduQuery AI API",
    description="Smart Student Performance Analytics",
    version="1.0.0"
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(students_router)
app.include_router(analytics_router)
app.include_router(ml_router)    # ← ADD THIS
app.include_router(ai_router)    # ← ADD THIS

@app.get("/")
def root():
    return {"message": "EduQuery AI API is running ✅"}