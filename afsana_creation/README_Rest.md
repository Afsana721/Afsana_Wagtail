AptiCraft Flow – small full‑stack REST application.

APP BRAND NAME: AptiCraft Flow

Concept:
AptiCraft Flow is a small REST‑based productivity platform to manage tasks, notes, and activity logs.

Core Modules:
1. Task Flow – manage project tasks
2. Note Craft – create and search notes
3. Activity Log – track user actions

Example REST:
POST /tasks
GET /tasks
POST /notes
GET /notes
GET /activity

*******************************************


Frontend UI communicates with Flask REST endpoints and database.

*******************************************

Stack:

Frontend: HTML + Tailwind + Jinja
Backend: Flask (Python REST API)
Database: PostgreSQL / SQLite
Cloud: Oracle Free Tier

Example Routes:
@app.route('/') → render_template('rest_api.html')
@app.route('/api/tasks') → GET tasks
@app.route('/api/tasks', methods=['POST']) → create task

Purpose:
Frontend UI communicates with Flask REST endpoints and database.
Purpose:
Demonstrate building UI, REST APIs, database operations, and cloud deployment for interview demo.
