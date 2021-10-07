import sqlite3
import json

connect = sqlite3.connect('Zengarden.db')

with open('testdialogue.json', 'r') as f:
    data = json.load(f)

    for line in data['Dialogue']:
        sql = "insert into Dialogue(text,option,font_size,time) values('%s',%s,%s,%s)" % (
            line['text'],
            line['option'],
            line['font_size'],
            line['time'])

        connect.execute(sql)

        connect.commit()

        connect.close()
