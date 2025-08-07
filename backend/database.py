import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="proyecto.cxeo6yakmese.us-east-2.rds.amazonaws.com",
        database="testdb",
        user="admindb",
        password="enerop2003", 
        port="5432"
    )