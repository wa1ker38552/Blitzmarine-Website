from flask import render_template
from flask import redirect
from flask import Flask

from database import Database
from threading import Thread
import time

# update internal cache every minute
def update_db_cache():
    global db_cache
    while True:
        time.sleep(60)
        db_cache = db.load()

app = Flask(__name__)
db = Database('database.json')
db_cache = db.load()

@app.route('/')
def app_index():
    return render_template('index.html')

@app.route('/about')
def app_about():
    return render_template('about.html')

@app.route('/members')
def app_members():
    return render_template('members.html')

@app.route('/members/<mid>')
def app_events_mid(mid):
    if mid in db_cache['members']:
        return render_template('member.html', data=db_cache['members'][mid], mid=mid)
    return render_template('404.html', type='Member')

@app.route('/events')
def app_events():
    return render_template('events.html')

@app.route('/events/<eid>')
def app_events_eid(eid):
    if eid in db_cache['events']:
        return render_template('event.html', data=db_cache['events'][eid])
    return render_template('404.html', type='Event')

@app.route('/api/members')
def api_members():
    return db_cache['members']

@app.route('/api/events')
def api_events():
    return db_cache['events']

@app.route('/api/events/<eid>')
def api_events_eid(eid):
    if eid in db_cache['events']:
        return db_cache['events'][eid]
    return None

@app.route('/api/members/<mid>')
def api_events_mid(mid):
    if mid in db_cache['members']:
        return db_cache['members'][mid]
    return None

# Thread(target=update_db_cache).start()
app.run(debug=True)