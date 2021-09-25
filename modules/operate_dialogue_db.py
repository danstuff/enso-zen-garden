from zengarden_database import db, Dialogue


# Add -------------------------------------------------------------
d = Dialogue(text="", options="", font_size="", time="", weather_type="", day_time="")


db.session.add(d)
db.session.commit()
# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get
dia = Dialogue.query.get()
print(dia.text)

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

dia = Dialogue.query.filter(Dialogue.text == "").update({"": ""})
print(dia) # numbers changed
db.session.commit()


# Delete -----------------------------------------------------------

dia = Dialogue.query.filter(Dialogue.text == "").delete()

db.session.commit()