from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/tw_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text, nullable=False)

@app.route('/')
def index():
    tasks = load_tasks_from_db()
    return render_template('index.html', tasks=tasks)

@app.route('/admin')
def admin():
    tasks = load_tasks_from_db()
    return render_template('admin.html', tasks=tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json()
    category_id = data['categoryId']
    task_description = data['taskDescription']
    
    # Save task to database
    save_task_to_db(category_id, task_description)
    
    return jsonify({'status': 'success'})

@app.route('/delete_task', methods=['POST'])
def delete_task():
    data = request.get_json()
    category_id = data['categoryId']
    task_description = data['taskDescription']
    
    # Delete task from database
    delete_task_from_db(category_id, task_description)
    
    return jsonify({'status': 'success'})

@app.route('/load_tasks', methods=['GET'])
def load_tasks():
    tasks = load_tasks_from_db()
    return jsonify(tasks)

@app.route('/send_tasks', methods=['POST'])
def send_tasks():
    data = request.get_json()
    category_id = data['categoryId']
    tasks = data['tasks']
    
    # Save tasks to a file or database for index.html
    with open('tasks.json', 'w') as f:
        json.dump({category_id: tasks}, f)
    
    return jsonify({'status': 'success'})

def save_task_to_db(category_id, task_description):
    new_task = Task(category_id=category_id, task_description=task_description)
    db.session.add(new_task)
    db.session.commit()

def delete_task_from_db(category_id, task_description):
    task = Task.query.filter_by(category_id=category_id, task_description=task_description).first()
    if task:
        db.session.delete(task)
        db.session.commit()

def load_tasks_from_db():
    tasks = Task.query.all()
    tasks_dict = {}
    for task in tasks:
        if task.category_id not in tasks_dict:
            tasks_dict[task.category_id] = []
        tasks_dict[task.category_id].append(task.task_description)
    return tasks_dict

# Adicione esta função para testar a conexão com o banco de dados
def test_db_connection():
    try:
        db.session.execute(text('SELECT 1'))
        print("Database connection successful!")
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        test_db_connection()  # Chame a função para testar a conexão
    app.run(debug=True)
