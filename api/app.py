#!/usr/bin/env python3

from flask import Flask
import time

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

if __name__ == '__main__':
    app.run(host='0.0.0.0')
