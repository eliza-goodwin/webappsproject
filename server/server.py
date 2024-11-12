from flask import Flask, request
from plans import PlansDB

app = Flask(__name__) 

#route for OPTIONS
@app.route("/plans/<int:plan_id>", methods=["OPTIONS"])
def handle_cors_options(plan_id):
    return "", 204, { #204 = No Content, successful request
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }
    
#route for GET
@app.route("/plans", methods=["GET"])
def retrieve_plans():
    db = PlansDB("plans_db.db")
    plans = db.getAllPlans()
    return plans, 200, {"Access-Control-Allow-Origin" : "*"}

#route for POST
@app.route("/plans", methods=["POST"])
def create_plan():
    db = PlansDB("plans_db.db")
    print("The request data is: ", request.form)
    day = request.form["day"];
    name = request.form["name"];
    date = request.form["date"];
    serving = request.form["serving"];
    category = request.form["category"];
    db.createPlan(day, name, date, serving, category)
    return "Created", 201, {"Access-Control-Allow-Origin" : "*"}
#QUESTION: does this automatically save in the database? in message log i had to manually save it, is that because it wasn't a database?
    
#route for PUT
@app.route("/plans/<int:plans_id>", methods=["PUT"])
def update_plan(plans_id):
    db = PlansDB("plans_db.db")
    print("update plan with ID", plans_id)
    plan = db.getSinglePlan(plans_id)
    
    #check that the recipie exists, if it doesn't, throw an error
    if plan:
        day = request.form["day"];
        name = request.form["name"];
        date = request.form["date"];
        serving = request.form["serving"];
        category = request.form["category"];
        db.updatePlan(plans_id, day, name, date, serving, category)
        return "Update",200,{"Access-Control-Allow-Origin" : "*"}
    else:
         return f"Plan with id {plans_id} not found", 404, {"Access-Control-Allow-Origin" : "*"}

@app.route("/plans/<int:plans_id>", methods=["DELETE"])
def delete_plan(plans_id):
    db = PlansDB("plans_db.db")
    plan = db.getSinglePlan(plans_id)
    if plan:
        db.deletePlan(plans_id)
        return "Delete", 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return "Not found!!", 404, {"Access-Control-Allow-Origin" : "*"}

@app.route("/plans/<int:plans_id>", methods=["GET"])
def retrieve_plan(plans_id):
    db = PlansDB("plans_db.db")
    plan = db.getSinglePlan(plans_id)
    if plan:
        return plan, 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return "Not found!!", 404, {"Access-Control-Allow-Origin" : "*"}

def run():
    app.run(port=8080, host='0.0.0.0') #added host='0.0.0.0' for deployment

if __name__ == "__main__":
    run()