import mysql.connector
import os

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "Amratanshu@2106"),
        database=os.getenv("DB_NAME", "eduquery_db")
    )

def run_query(query: str, params=None, fetch=True):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params or ())
    if fetch:
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    else:
        conn.commit()
        cursor.close()
        conn.close()