-- ================================================
-- EduQuery AI - Full Database Schema
-- ================================================

CREATE DATABASE IF NOT EXISTS eduquery_db;
USE eduquery_db;

-- ------------------------------------------------
-- TABLE 1: students
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    student_id     INT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(100) UNIQUE NOT NULL,
    gender         ENUM('Male', 'Female', 'Other') NOT NULL,
    dob            DATE,
    enrolled_year  YEAR NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- TABLE 2: subjects
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    subject_id   INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    max_marks    INT DEFAULT 100,
    credits      INT DEFAULT 3
);

-- ------------------------------------------------
-- TABLE 3: marks
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS marks (
    mark_id      INT AUTO_INCREMENT PRIMARY KEY,
    student_id   INT NOT NULL,
    subject_id   INT NOT NULL,
    exam_type    ENUM('Midterm', 'Final', 'Assignment') NOT NULL,
    marks_scored INT NOT NULL,
    exam_date    DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- TABLE 4: attendance
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id    INT AUTO_INCREMENT PRIMARY KEY,
    student_id       INT NOT NULL,
    subject_id       INT NOT NULL,
    attendance_date  DATE NOT NULL,
    status           ENUM('Present', 'Absent', 'Late') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- TABLE 5: teachers
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id   INT AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(100) UNIQUE NOT NULL,
    subject_id   INT,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);