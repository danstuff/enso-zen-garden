#from zengarden_database import db, Garden


# Add -------------------------------------------------------------
#g = Garden(water_level="water level")

#db.session.add(g)
#db.session.commit()
# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get
#gar = Garden.query.get()
#print(gar.water_level)

# check all
# gar = Garden.query.all()
# for i in ger:
#     print(i)

# filter()
# gar = Garden.query.filter(Garden.water_level <>==)
# for i in gar:
#     print(i.water_level)

# filter_by()
# gar = Garden.query.filter_by(Garden.water_level=" ").all()
# print(gar)

# Change -----------------------------------------------------------

#gar = Garden.query.filter(Garden.water_level == "").update({"": ""})
#print(gar) # numbers changed
#db.session.commit()


# Delete -----------------------------------------------------------

#gar = Garden.query.filter(Garden.water_level == "").delete()

#db.session.commit()
