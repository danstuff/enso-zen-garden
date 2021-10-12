import sqlite3
import json

connect = sqlite3.connect('Zengarden.db')

with open('testentity.json', 'r') as f:
    data = json.load(f)

    for line in data['Entity']:
        sql = "insert into Entity(pos,type_id,exist_time) values('%s',%s,%s)" % (
            line['pos'],
            line['type_id'],
            line['exist_time']
            )

        connect.execute(sql)

        connect.commit()

        connect.close()
