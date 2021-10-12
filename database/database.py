import sqlite3

conn = sqlite3.connect('Zengarden.db')

cur = conn.cursor()

cur.execute('''

CREATE TABLE Dialogue (
    id                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    dialogue_html     STRING  NOT NULL UNIQUE,
    weather_condition STRING  NOT NULL UNIQUE,
    wind_speed_min    INTEGER NOT NULL UNIQUE,
    wind_speed_max    INTEGER NOT NULL UNIQUE,
    day_time_start    INTEGER NOT NULL UNIQUE,
    day_time_length   INTEGER NOT NULL UNIQUE
    
);
CREATE TABLE Mesh (
    id           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    mesh_json    STRING  NOT NULL UNIQUE
);


''')
