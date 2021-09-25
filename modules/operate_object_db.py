from zengarden_database import db, Object


# Add -------------------------------------------------------------
ob = Object(pos="", mesh_pos="")


db.session.add(ob)
db.session.commit()
# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get
obj = Object.query.get()
print(obj.pos)

# check all
# obj = Object.query.all()
# for i in obj:
#     print(i)

# filter()
# obj = Object.query.filter(Object. <>==)
# for i in obj:
#     print(i.)

# filter_by()
# obj = Object.query.filter_by(Object. =" ").all()
# print(obj)

# Change -----------------------------------------------------------

obj = Object.query.filter(Object.pos == "").update({"": ""})
print(obj) # numbers changed
db.session.commit()


# Delete -----------------------------------------------------------

obj = Object.query.filter(Object.pos == "").delete()

db.session.commit()