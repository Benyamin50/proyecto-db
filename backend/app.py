from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS
from app import app

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="proyecto.cxeo6yakmese.us-east-2.rds.amazonaws.com",
        database="testdb",
        user="admindb",
        password="enerop2003",
        port="5432"
    )


@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM usuarios')
    usuarios = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{
        'id': u[0],
        'nombre': u[1],
        'correo': u[2],
        'edad': u[3]
    } for u in usuarios])

# POST: Crear usuario
@app.route('/api/usuarios', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'INSERT INTO usuarios (nombre, correo, edad) VALUES (%s, %s, %s) RETURNING id',
            (data['nombre'], data['correo'], data['edad'])
        )
        id = cur.fetchone()[0]
        conn.commit()
        return jsonify({'id': id, 'nombre': data['nombre'], 'correo': data['correo'], 'edad': data['edad']}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

# PUT: Actualizar usuario
@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'UPDATE usuarios SET nombre = %s, correo = %s, edad = %s WHERE id = %s RETURNING id',
            (data['nombre'], data['correo'], data['edad'], id)
        )
        if cur.rowcount == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        conn.commit()
        return jsonify({'id': id, 'nombre': data['nombre'], 'correo': data['correo'], 'edad': data['edad']})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

# DELETE: Eliminar usuario
@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('DELETE FROM usuarios WHERE id = %s', (id,))
        if cur.rowcount == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Usuario eliminado'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)