USE eduquery_db;

-- ------------------------------------------------
-- INSERT: subjects
-- ------------------------------------------------
INSERT INTO subjects (subject_name, subject_code, max_marks, credits) VALUES
('Mathematics',         'MATH101', 100, 4),
('Physics',             'PHY101',  100, 4),
('Computer Science',    'CS101',   100, 4),
('English',             'ENG101',  100, 3),
('Data Structures',     'CS201',   100, 4);

-- ------------------------------------------------
-- INSERT: teachers
-- ------------------------------------------------
INSERT INTO teachers (full_name, email, subject_id) VALUES
('Dr. Priya Sharma',    'priya@edu.com',   1),
('Prof. Rajan Mehta',   'rajan@edu.com',   2),
('Ms. Anjali Singh',    'anjali@edu.com',  3),
('Mr. Vikram Nair',     'vikram@edu.com',  4),
('Dr. Neha Gupta',      'neha@edu.com',    5);

-- ------------------------------------------------
-- INSERT: students (30 students shown — script
--          auto-generates 100 in Python seeder)
-- ------------------------------------------------
INSERT INTO students (full_name, email, gender, dob, enrolled_year) VALUES
('Aarav Sharma',     'aarav@student.com',    'Male',   '2003-04-12', 2022),
('Meera Patel',      'meera@student.com',    'Female', '2003-07-23', 2022),
('Rohan Verma',      'rohan@student.com',    'Male',   '2002-11-05', 2022),
('Sneha Iyer',       'sneha@student.com',    'Female', '2003-01-18', 2022),
('Karan Malhotra',   'karan@student.com',    'Male',   '2003-06-30', 2022),
('Priya Nair',       'priyaN@student.com',   'Female', '2002-09-14', 2022),
('Arjun Desai',      'arjun@student.com',    'Male',   '2003-03-22', 2022),
('Divya Rao',        'divya@student.com',    'Female', '2003-08-09', 2022),
('Nikhil Joshi',     'nikhil@student.com',   'Male',   '2002-12-01', 2022),
('Pooja Kulkarni',   'pooja@student.com',    'Female', '2003-05-27', 2022),
('Aditya Kumar',     'aditya@student.com',   'Male',   '2003-02-14', 2023),
('Ishaan Tripathi',  'ishaan@student.com',   'Male',   '2002-10-08', 2023),
('Kavya Menon',      'kavya@student.com',    'Female', '2003-07-16', 2023),
('Siddharth Bose',   'siddharth@student.com','Male',   '2003-04-03', 2023),
('Ananya Chatterjee','ananya@student.com',   'Female', '2002-11-29', 2023),
('Rahul Pandey',     'rahul@student.com',    'Male',   '2003-09-11', 2023),
('Shruti Agarwal',   'shruti@student.com',   'Female', '2003-01-25', 2023),
('Varun Sinha',      'varun@student.com',    'Male',   '2002-06-17', 2023),
('Tanvi Mishra',     'tanvi@student.com',    'Female', '2003-03-08', 2023),
('Yash Kapoor',      'yash@student.com',     'Male',   '2003-08-20', 2023);

-- ------------------------------------------------
-- INSERT: marks (sample — Python seeder fills rest)
-- ------------------------------------------------
INSERT INTO marks (student_id, subject_id, exam_type, marks_scored, exam_date) VALUES
(1, 1, 'Midterm',    72, '2023-03-15'),
(1, 2, 'Midterm',    65, '2023-03-16'),
(1, 3, 'Midterm',    88, '2023-03-17'),
(1, 1, 'Final',      78, '2023-06-10'),
(1, 2, 'Final',      55, '2023-06-11'),
(1, 3, 'Final',      91, '2023-06-12'),
(2, 1, 'Midterm',    45, '2023-03-15'),
(2, 2, 'Midterm',    50, '2023-03-16'),
(2, 3, 'Midterm',    60, '2023-03-17'),
(2, 1, 'Final',      40, '2023-06-10'),
(2, 2, 'Final',      48, '2023-06-11'),
(2, 3, 'Final',      55, '2023-06-12');

-- ------------------------------------------------
-- INSERT: attendance (sample)
-- ------------------------------------------------
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(1, 1, '2023-01-10', 'Present'),
(1, 1, '2023-01-12', 'Present'),
(1, 1, '2023-01-14', 'Absent'),
(1, 2, '2023-01-10', 'Present'),
(1, 2, '2023-01-12', 'Late'),
(2, 1, '2023-01-10', 'Absent'),
(2, 1, '2023-01-12', 'Absent'),
(2, 1, '2023-01-14', 'Present'),
(2, 2, '2023-01-10', 'Absent'),
(2, 2, '2023-01-12', 'Absent');