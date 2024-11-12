import sqlite3

#CREATING A DICTIONARY FACTORY (from module)
def dict_factory(cursor, row):
 fields = []
 # Extract column names from cursor description
 for column in cursor.description:
    fields.append(column[0])
 # Create a dictionary where keys are column names and values are row values
 result_dict = {}
 for i in range(len(fields)):
    result_dict[fields[i]] = row[i]
 return result_dict

class PlansDB:
    def __init__(self, filename):
        #conect to DB file recipies_db.db
        self.connection = sqlite3.connect(filename)
        self.connection.row_factory = dict_factory
        #use the connection instance to perform our db operations
        #create a cursor instance for the connection
        self.cursor = self.connection.cursor()
        
    #get ALL plans    
    def getAllPlans(self):
        #setting our curser to THIS spot, not actually selecting anything
        #now that we have an access point we can fetch all or one
        #ONLY applicable use of fetch is following a SELECT query
        self.cursor.execute("SELECT * FROM plans")
        plans = self.cursor.fetchall()
        return plans
    
    #get only ONE plan
    def getSinglePlan(self, plan_id):
        data = [plan_id]
        self.cursor.execute("SELECT * FROM plans WHERE id = ?", data) 
        plan = self.cursor.fetchone()
        return plan
    
    def createPlan(self, day, name, date, serving, category):
        data = [day, name, date, serving, category]
        #add a new plan to the db
        self.cursor.execute("INSERT INTO plans(day, name, date, serving, category) VALUES (?,?,?,?,?)", data)
        self.connection.commit() #gotta save the connection or else it won't actually add to the db

    def updatePlan(self, plan_id, day, name, date, serving, category):
        data = [ day, name, date, serving, category, plan_id ]
        self.cursor.execute("UPDATE plans SET day = ?, name = ?, date = ?, serving = ?, category = ? WHERE ID = ?", data) #wondering if ID needs to be plan_id
        self.connection.commit() #SAVE UPDATE
        
    def deletePlan(self, plan_id):
        data = [plan_id]
        self.cursor.execute("DELETE FROM plans WHERE ID = ?", data)
        self.connection.commit()