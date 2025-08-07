from flask import Blueprint, request, jsonify
from .database import get_db_connection
from flask_cors import CORS

# Crea un Blueprint para las rutas API
bp = Blueprint('api', __name__, url_prefix='/api')
CORS(bp)  # Aplica CORS solo a estas rutas

@bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('SELECT * FROM usuarios')
        usuarios = cur.fetchall()
        return jsonify([{
            'id': u[0],
            'nombre': u[1],
            'correo': u[2], 
            'edad': u[3]
        } for u in usuarios])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

@bp.route('/usuarios', methods=['POST'])
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
        return jsonify({
            'id': id,
            'nombre': data['nombre'],
            'correo': data['correo'],
            'edad': data['edad']
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

@bp.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'UPDATE usuarios SET nombre = %s, correo = %s, edad = %s WHERE id = %s',
            (data['nombre'], data['correo'], data['edad'], id)
        )
        if cur.rowcount == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        conn.commit()
        return jsonify({
            'id': id,
            'nombre': data['nombre'],
            'correo': data['correo'],
            'edad': data['edad']
        })
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

@bp.route('/usuarios/<int:id>', methods=['DELETE'])
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