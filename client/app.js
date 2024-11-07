// when a new day is added, it needs to somehow create a new row
console.log("connected");

//DON'T FORGET TO CHANGE THIS
const apiURL = window.location.protocol === 'file:'
    ? 'http://localhost:8080/backend' // local api server during development
    : 'http://planner.zorran.tech/backend'; //Production API

loadPlansFromServer();

let menuPlannerWrapper = document.querySelector(".left-column");
let newPlanWrapper = document.querySelector(".new-plans")

//first I need to make the form that pops up when the "Add New" button is clicked
let modalbutton =  document.querySelector("#add-new-button")
let modalclose = document.querySelector("#close-modal")
let modal = document.querySelector(".modal")
let addPlanButton = document.querySelector("#add-plan-button")

//open it
modalbutton.onclick = function (){
    modal.style.display = "flex";
}
//close it
modalclose.onclick = function() {
    modal.style.display = "none";
}
//THIS PART ALSO NEEDS TO ADD THE PLAN TO THE DATABASE
addPlanButton.onclick = function() {
    modal.style.display = "none";
    addOrEditNewPlanToSever();
}

function clearModal() {
    let day = document.querySelector("#day-input");
    let name = document.querySelector("#name-input");
    let date = document.querySelector("#date-input");
    let serving = document.querySelector("#serving-input");
    let category = document.querySelector("#category-input");

    day.value = "";
    name.value = "";
    date.value = "";
    serving.value = "";
    category.value = "";

}

isEditing = false;
editingID = 0;

//add a new plan: POST
function addOrEditNewPlanToSever() {
    console.log("add button clicked");

    if (isEditing) {

        let day = document.querySelector("#day-input");
        let name = document.querySelector("#name-input");
        let date = document.querySelector("#date-input");
        let serving = document.querySelector("#serving-input");
        let category = document.querySelector("#category-input");

        //don't allow empty feild
        while (!day.value || !name.value || !date.value || !serving.value || !category.value) {
            alert("Please fill in all fields before adding a plan.");
            return //if there is time, make this not get rid of the modal
        }

        //PUT REQUEST 
        //prep data to send to the server
        let data = "day=" + encodeURIComponent(day.value);
        data += "&name=" + encodeURIComponent(name.value);
        data += "&date=" + encodeURIComponent(date.value);
        data += "&serving=" + encodeURIComponent(serving.value);
        data += "&category=" + encodeURIComponent(category.value);
        //will show as day=Monday&name=Steak%potatoes&....
        fetch(apiURL + "/plans/" + editingID, {
            method: "PUT",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(response) {
            console.log("new plan created", response)
            clearModal()
            loadPlansFromServer()
            isEditing = false
        })

    } else {
        let day = document.querySelector("#day-input");
        let name = document.querySelector("#name-input");
        let date = document.querySelector("#date-input");
        let serving = document.querySelector("#serving-input");
        let category = document.querySelector("#category-input");

        //don't allow empty feild
        while (!day.value || !name.value || !date.value || !serving.value || !category.value) {
            alert("Please fill in all fields before adding a plan.");
            return //if there is time, make this not get rid of the modal
        }

        //prep data to send to the server
        let data = "day=" + encodeURIComponent(day.value);
        data += "&name=" + encodeURIComponent(name.value);
        data += "&date=" + encodeURIComponent(date.value);
        data += "&serving=" + encodeURIComponent(serving.value);
        data += "&category=" + encodeURIComponent(category.value);
        //will show as day=Monday&name=Steak%potatoes&....

        //POST REQUEST
        //send new plan to the server
        console.log(data)
        fetch(apiURL + "/plans", {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(response) {
            console.log("new plan created", response)
            clearModal()
            loadPlansFromServer()
        })
    }
    //get values from input boxes
}

//CREATE
function loadPlansFromServer() { 
    let allPlans = document.querySelector(".plans");
    allPlans.innerHTML = ""
    fetch(apiURL + "/plans")
    .then(function(response) {
        response.json()
            .then(function(data){
                console.log(data);
                let plans = data;
                plans.forEach(addNewPlan)
            })
    })    
}

//display the plans and formatting for new ones
function addNewPlan(data) {
    console.log("data", data);

    let breaks = document.createElement("br");

    let newPlan = document.createElement("div");
    newPlan.classList.add("new-plan");

    let newPlanContentDay = document.createElement("h2");
    newPlanContentDay.textContent = `${data.day} : ${data.name}`;
    newPlan.appendChild(newPlanContentDay);
    let line = document.createElement("hr");
    newPlan.appendChild(line);
    newPlan.appendChild(breaks);

    let newPlanContentDate = document.createElement("h2");
    newPlanContentDate.innerHTML = `&nbsp;&nbsp;${data.date} &nbsp;&nbsp;&nbsp;&nbsp; Servings: ${data.serving} &nbsp;&nbsp;&nbsp;&nbsp;Category: ${data.category}`;
    newPlan.appendChild(newPlanContentDate);

    let editButton = document.createElement("button");
    editButton.id = "new-plan-edit-button";
    editButton.textContent = "Edit";
    newPlan.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.id = "new-plan-delete-button";
    deleteButton.textContent= "Delete";
    newPlan.appendChild(deleteButton);

    // Append to `.plans` instead of clearing other elements
    document.querySelector(".plans").appendChild(newPlan);

    editButton.onclick = function () {
        modal.style.display = "flex";
        //autofilling the form
        //get values from input boxes
        let day = document.querySelector("#day-input");
        let name = document.querySelector("#name-input");
        let date = document.querySelector("#date-input");
        let serving = document.querySelector("#serving-input");
        let category = document.querySelector("#category-input");

        console.log("day: ", data.day);
        console.log("name: ", data.name);
        console.log(": ", data.day);
        
        //UPDATE
        fetch(apiURL + "/plans/" + data.ID)
            .then(function(response) {
                response.json()
                    .then(function(data){
                        console.log(data);
                        day.value = data.day;
                        name.value = data.name;
                        date.value = data.date;
                        serving.value = data.serving;
                        category.value = data.category;
                        editingID = data.ID;
                    })
            })    
        isEditing = true
        
    }

    deleteButton.onclick = function() {
        //this needs to remove the plan with the right plans_id from the database
        console.log("deleting plan with ID: ", data.ID);

        //DELETE
        if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS PLAN??") == true) {
            fetch(apiURL + "/plans/" + data.ID, {
                method: "DELETE"
            }).then(function(response) {
                console.log("deleted plan", response)
                loadPlansFromServer();
            })
        }

    }

};

//THIS IS FOR THE GROCERY LIST 

document.getElementById("add-new-item-to-list").addEventListener("click", function() {
    // Get the input value
    const input = document.getElementById("grocery-list-input");
    const itemText = input.value.trim();

    // Check if the input is not empty
    if (itemText) {
        // Create a new list item
        const li = document.createElement("li");
        li.textContent = itemText;

        // Append the new item to the list
        document.getElementById("grocery-list-ul").appendChild(li);

        // Clear the input field
        input.value = "";
    } else {
        alert("Please enter an item.");
    }
});