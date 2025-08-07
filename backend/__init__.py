from flask import Flask
from .database import get_db_connection

def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config.from_pyfile('config.py', silent=True)
    
   
    from .routes import bp
    app.register_blueprint(bp)
    
    return app

app = create_app()