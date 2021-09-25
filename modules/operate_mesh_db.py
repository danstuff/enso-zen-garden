from zengarden_database import db, Mesh


# Add -------------------------------------------------------------
m = Mesh(vertices="", colors="")


db.session.add(m)
db.session.commit()
# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get
mes = Mesh.query.get()
print(mes.vertices)

# check all
# mes = Mesh.query.all()
# for i in mes:
#     print(i)

# filter()
# mes = Mesh.query.filter(Mesh. <>==)
# for i in mes:
#     print(i.)

# filter_by()
# mes = Mesh.query.filter_by(Mesh. =" ").all()
# print(mes)

# Change -----------------------------------------------------------

mes = Mesh.query.filter(Mesh.vertices == "").update({"": ""})
print(mes) # numbers changed
db.session.commit()


# Delete -----------------------------------------------------------

mes = Mesh.query.filter(Mesh.vertices == "").delete()

db.session.commit()