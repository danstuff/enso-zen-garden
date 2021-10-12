import json

from zengarden_database import db, Entities


# Add -------------------------------------------------------------
def main_add1():
    print('import data')
    result = []
    with open('json address', encoding='utf-8') as f:
        result.append(json.load(f))
        if result != None:
            for r in result:
                for i in r:
                    try:
                        ob = Entities(pos=i['position'], mesh_pos=i['mesh position'])
                        db.session.add(ob)
                    except:
                        db.session.delete(ob)
                db.session.commit()

               # return render_template('success', content='import success')
         #   return ''

# add all
# db.session.add_all()
# db.session.commit()

# Check ------------------------------------------------------------
# get

# check all
#en = Entities.query.all()
#data =  {
    #'position': Entities.pos,
    #'mesh position': Entities.mesh_pos
#}
#jsonified_data = json.dumps(data)

# filter()
# obj = Object.query.filter(Object. <>==)
# for i in obj:
#     print(i.)

# filter_by()
# obj = Object.query.filter_by(Object. =" ").all()
# print(obj)

# Change -----------------------------------------------------------

#obj = Object.query.filter(Object.pos == "").update({"": ""})
#print(obj) # numbers changed
#db.session.commit()


# Delete -----------------------------------------------------------

#obj = Object.query.filter(Object.pos == "").delete()

#db.session.commit()
