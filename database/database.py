import sqlite3

conn = sqlite3.connect('Zengarden.db')

cur = conn.cursor()

cur.execute('''

CREATE TABLE Dialogue (
    id           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    text         STRING  NOT NULL UNIQUE,
    option       STRING  NOT NULL UNIQUE,
    font_size    INTEGER NOT NULL UNIQUE,
    time         REAL    NOT NULL UNIQUE
);


''')
