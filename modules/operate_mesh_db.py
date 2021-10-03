from zengarden_database import db, Mesh


# Add -------------------------------------------------------------
def main_add3():
    print('import data')
    result = []
    with open('json address', encoding='utf-8') as f:
        result.append(json.load(f))
        if result != None:
            for r in result:
                for i in r:
                    try:
                        me = Mesh(vertices=i['vertices'], colors=i['colors'])
                        db.session.add(me)
                    except:
                        db.session.delete(me)
                db.session.commit()

                #return render_template('success', content='import success')
            #return ''
# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get
#mes = Mesh.query.get()
#print(mes.vertices)

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

#mes = Mesh.query.filter(Mesh.vertices == "").update({"": ""})
#print(mes) # numbers changed
#db.session.commit()


# Delete -----------------------------------------------------------

#mes = Mesh.query.filter(Mesh.vertices == "").delete()

#db.session.commit()
