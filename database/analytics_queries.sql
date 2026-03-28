USE eduquery_db;

-- ================================================
-- QUERY 1: Average marks per student (JOIN + GROUP BY)
-- ================================================
SELECT
    s.student_id,
    s.full_name,
    ROUND(AVG(m.marks_scored), 2)  AS avg_marks,
    COUNT(m.mark_id)               AS exams_taken
FROM students s
JOIN marks m ON s.student_id = m.student_id
GROUP BY s.student_id, s.full_name
ORDER BY avg_marks DESC;

-- ================================================
-- QUERY 2: Attendance % per student per subject
--          (JOIN across 3 tables)
-- ================================================
SELECT
    s.full_name,
    sub.subject_name,
    COUNT(a.attendance_id)                            AS total_classes,
    SUM(a.status = 'Present')                         AS present_count,
    ROUND(SUM(a.status = 'Present') * 100.0
          / COUNT(a.attendance_id), 1)                AS attendance_pct
FROM students s
JOIN attendance a  ON s.student_id  = a.student_id
JOIN subjects  sub ON a.subject_id  = sub.subject_id
GROUP BY s.student_id, sub.subject_id
ORDER BY attendance_pct ASC;

-- ================================================
-- QUERY 3: AT-RISK students — below 50% avg marks
--          AND below 60% attendance (CTE)
-- ================================================
WITH student_avg_marks AS (
    SELECT student_id, ROUND(AVG(marks_scored), 2) AS avg_marks
    FROM marks
    GROUP BY student_id
),
student_attendance AS (
    SELECT
        student_id,
        ROUND(SUM(status = 'Present') * 100.0 / COUNT(*), 1) AS attend_pct
    FROM attendance
    GROUP BY student_id
)
SELECT
    s.full_name,
    sam.avg_marks,
    sa.attend_pct,
    'AT RISK' AS risk_flag
FROM students s
JOIN student_avg_marks sam ON s.student_id = sam.student_id
JOIN student_attendance sa  ON s.student_id = sa.student_id
WHERE sam.avg_marks < 50 AND sa.attend_pct < 60
ORDER BY sam.avg_marks ASC;

-- ================================================
-- QUERY 4: Rank students by performance (WINDOW FUNCTION)
-- ================================================
SELECT
    s.full_name,
    ROUND(AVG(m.marks_scored), 2)                          AS avg_marks,
    RANK()     OVER (ORDER BY AVG(m.marks_scored) DESC)    AS rank_overall,
    PERCENT_RANK() OVER (ORDER BY AVG(m.marks_scored))     AS percentile
FROM students s
JOIN marks m ON s.student_id = m.student_id
GROUP BY s.student_id, s.full_name;

-- ================================================
-- QUERY 5: Subject-wise pass/fail rate
-- ================================================
SELECT
    sub.subject_name,
    COUNT(DISTINCT m.student_id)                       AS total_students,
    SUM(m.marks_scored >= 40)                          AS passed,
    SUM(m.marks_scored < 40)                           AS failed,
    ROUND(SUM(m.marks_scored >= 40) * 100.0
          / COUNT(DISTINCT m.student_id), 1)           AS pass_rate_pct
FROM subjects sub
JOIN marks m ON sub.subject_id = m.subject_id
WHERE m.exam_type = 'Final'
GROUP BY sub.subject_id
ORDER BY pass_rate_pct ASC;

-- ================================================
-- QUERY 6: Top performer per subject (WINDOW FUNCTION)
-- ================================================
SELECT subject_name, full_name, avg_marks
FROM (
    SELECT
        sub.subject_name,
        s.full_name,
        ROUND(AVG(m.marks_scored), 2)                        AS avg_marks,
        ROW_NUMBER() OVER (
            PARTITION BY sub.subject_id
            ORDER BY AVG(m.marks_scored) DESC
        )                                                    AS rn
    FROM students s
    JOIN marks m   ON s.student_id  = m.student_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    GROUP BY sub.subject_id, s.student_id
) ranked
WHERE rn = 1;

-- ================================================
-- QUERY 7: Grade banding (CASE WHEN)
-- ================================================
SELECT
    s.full_name,
    ROUND(AVG(m.marks_scored), 2) AS avg_marks,
    CASE
        WHEN AVG(m.marks_scored) >= 90 THEN 'A+'
        WHEN AVG(m.marks_scored) >= 75 THEN 'A'
        WHEN AVG(m.marks_scored) >= 60 THEN 'B'
        WHEN AVG(m.marks_scored) >= 45 THEN 'C'
        ELSE                                'F'
    END AS grade
FROM students s
JOIN marks m ON s.student_id = m.student_id
GROUP BY s.student_id, s.full_name
ORDER BY avg_marks DESC;

-- ================================================
-- QUERY 8: Monthly performance trend (DATE functions)
-- ================================================
SELECT
    s.full_name,
    MONTHNAME(m.exam_date)        AS exam_month,
    ROUND(AVG(m.marks_scored), 2) AS avg_marks
FROM students s
JOIN marks m ON s.student_id = m.student_id
GROUP BY s.student_id, MONTH(m.exam_date)
ORDER BY s.student_id, MONTH(m.exam_date);

-- ================================================
-- QUERY 9: Stored procedure — get full student report
-- ================================================
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS GetStudentReport(IN p_student_id INT)
BEGIN
    SELECT
        s.full_name,
        s.email,
        sub.subject_name,
        m.exam_type,
        m.marks_scored,
        ROUND(m.marks_scored * 100.0 / sub.max_marks, 1) AS score_pct
    FROM students s
    JOIN marks    m   ON s.student_id  = m.student_id
    JOIN subjects sub ON m.subject_id  = sub.subject_id
    WHERE s.student_id = p_student_id
    ORDER BY sub.subject_name, m.exam_type;
END $$
DELIMITER ;

-- Call it:
-- CALL GetStudentReport(1);

-- ================================================
-- QUERY 10: Trigger — log when a student fails
-- ================================================
CREATE TABLE IF NOT EXISTS fail_log (
    log_id     INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    marks      INT,
    logged_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER IF NOT EXISTS after_marks_insert
AFTER INSERT ON marks
FOR EACH ROW
BEGIN
    IF NEW.marks_scored < 40 THEN
        INSERT INTO fail_log (student_id, subject_id, marks)
        VALUES (NEW.student_id, NEW.subject_id, NEW.marks_scored);
    END IF;
END $$
DELIMITER ;