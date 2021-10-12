import sqlite3
import json

connect = sqlite3.connect('Zengarden.db')

with open('testdialogue.json', 'r') as f:
    data = json.load(f)

    for line in data['Dialogue']:
        sql = "insert into Dialogue(text,option,font_size,time) values('%s',%s,%s,%s,%s,%s)" % (
            line['dialogue_html'],
            line['weather_condition'],
            line['wind_speed_min'],
            line['wind_speed_max'],
            line['day_time_start'],
            line['day_time_length']
        )

        connect.execute(sql)

        connect.commit()

        connect.close()
