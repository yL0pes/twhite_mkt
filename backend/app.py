from flask import Flask, request, jsonify, render_template, redirect, url_for
from bs4 import BeautifulSoup
import json
import os

app = Flask(__name__)

DATA_FILE = 'c:/Users/Patrick/OneDrive/Documents/twhite_mkt/backend/tasks.json'

@app.route('/')
def index():
    tasks = load_tasks_from_json()
    return render_template('index.html', tasks=tasks)

@app.route('/admin')
def admin():
    tasks = load_tasks_from_json()
    return render_template('admin.html', tasks=tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    category_id = request.form['categoryId']
    task_description = request.form['taskDescription']
    
    # Save task to JSON file
    save_task_to_json(category_id, task_description)
    
    # Update index.html with the new task
    update_index_html(category_id, task_description)
    
    return jsonify({'status': 'success'})

@app.route('/delete_task', methods=['POST'])
def delete_task():
    category_id = request.form['categoryId']
    task_description = request.form['taskDescription']
    
    # Delete task from JSON file
    delete_task_from_json(category_id, task_description)
    
    # Update index.html to remove the task
    update_index_html(category_id, task_description, delete=True)
    
    return jsonify({'status': 'success'})

@app.route('/load_tasks', methods=['GET'])
def load_tasks():
    tasks = load_tasks_from_json()
    return jsonify(tasks)

def save_task_to_json(category_id, task_description):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            tasks = json.load(file)
    else:
        tasks = {}

    if category_id not in tasks:
        tasks[category_id] = []

    tasks[category_id].append(task_description)

    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(tasks, file, ensure_ascii=False, indent=4)

def delete_task_from_json(category_id, task_description):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            tasks = json.load(file)
    else:
        tasks = {}

    if category_id in tasks:
        tasks[category_id] = [task for task in tasks[category_id] if task != task_description]

    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(tasks, file, ensure_ascii=False, indent=4)

def load_tasks_from_json():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            tasks = json.load(file)
    else:
        tasks = {}
    return tasks

def update_index_html(category_id, task_description, delete=False):
    with open('c:/Users/Patrick/OneDrive/Documents/twhite_mkt/admin/index.html', 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
    
    category_map = {
        'acoes-boards': 'acoes-card',
        'marketing-boards': 'marketing-card',
        'rh-boards': 'rh-card',
        'loja-boards': 'loja-card'
    }
    card_id = category_map.get(category_id)
    if card_id:
        card_element = soup.find(id=card_id)
        if card_element:
            if delete:
                task_elements = card_element.find_all('div', class_='list-group-item')
                for task_element in task_elements:
                    if task_element.text.strip() == task_description:
                        task_element.decompose()
            else:
                task_element = soup.new_tag('div', **{'class': 'list-group-item d-flex justify-content-between align-items-center'})
                task_element.string = task_description
                delete_button = soup.new_tag('button', **{'class': 'noselect'})
                delete_button.append(soup.new_tag('span', **{'class': 'text'}))
                delete_button.span.string = 'Delete'
                delete_button.append(soup.new_tag('span', **{'class': 'icon'}))
                delete_button.span.append(soup.new_tag('svg', xmlns="http://www.w3.org/2000/svg", width="24", height="24", viewBox="0 0 24 24"))
                delete_button.span.svg.append(soup.new_tag('path', d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"))
                task_element.append(delete_button)
                card_element.find(class_='card2').append(task_element)
    
    with open('c:/Users/Patrick/OneDrive/Documents/twhite_mkt/admin/index.html', 'w', encoding='utf-8') as file:
        file.write(str(soup))

if __name__ == '__main__':
    app.run(debug=True)
