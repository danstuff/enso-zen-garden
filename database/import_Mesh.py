import sqlite3
import json

connect = sqlite3.connect('Zengarden.db')

with open('testmesh.json', 'r') as f:
    data = json.load(f)

    for line in data['Mesh']:
        sql = "insert into Mesh(vertices,color) values('%s',%s)" % (
            line['vertices'],
            line['color']
        )

        connect.execute(sql)

        connect.commit()

        connect.close()
