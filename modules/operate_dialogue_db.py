from zengarden_database import db, Dialogue


# Add -------------------------------------------------------------
def main_add2():
    print('import data')
    result = []
    with open('json address', encoding='utf-8') as f:
        result.append(json.load(f))
        if result != None:
            for r in result:
                for i in r:
                    try:
                        di = Dialogue(text=i['text'], options=i['options'],
                                      font_size=i['font size'], time=i['time'],
                                      weather_type=i['weather type'],
                                      day_time=i['day time'])
                        db.session.add(di)
                    except:
                        db.session.delete(di)
                db.session.commit()

                #return render_template('success', content='import success')
            #return ''
# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get
#dia = Dialogue.query.get()
di = Dialogue.query.all()
data =  {
    'text': Dialogue.text,
    'options': Dialogue.options,
    'font size': Dialogue.font_size,
    'time': Dialogue.time,
    'weather type': Dialogue.weather_type,
    'day time': Dialogue.day_time
}
jsonified_data = json.dumps(data)

# check all
# dia = Dialogue.query.all()
# for i in dia:
#     print(i)

# filter()
# dia = Dialogue.query.filter(Dialogue. <>==)
# for i in dia:
#     print(i.)

# filter_by()
# dia = Dialogue.query.filter_by(Dialogue. =" ").all()
# print(dia)

# Change -----------------------------------------------------------

#dia = Dialogue.query.filter(Dialogue.text == "").update({"": ""})
#print(dia) # numbers changed
#db.session.commit()


# Delete -----------------------------------------------------------

#dia = Dialogue.query.filter(Dialogue.text == "").delete()

#db.session.commit()
