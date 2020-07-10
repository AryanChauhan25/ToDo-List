
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://atlas-levi25:test25012001@todo-list.vw2ki.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemSchema = {
    name: {
        type: String,
        required: true
    }
}
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
    name: "Welcome to ToDo List"
});
const item2 = new Item({
    name: "Click + to add items"
});
const item3 = new Item({
    name: "<-- Click here to remove items"
});
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
}
const List = mongoose.model("List", listSchema);

app.get("/", function(req,res) {
    // const day = date.listdate();
    // res.render("list",{listTitle: date, newListItems: items});
    Item.find({}, function(err,items) {
        if(items.length === 0){
            Item.insertMany(defaultItems, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("defaultItems are successfully added.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list",{listTitle: "Today", newListItems: items});
        }
    });
})

app.get("/:newList", function(req,res) {
    const newList = _.capitalize(req.params.newList);
    if(req.params.newList === "about"){
        res.render("about");
    } else{
        List.findOne({name: newList}, function(err, findList) {
            if(!err){
                if(!findList){
                    //create new list
                    const list1 = new List({
                        name: newList,
                        items: defaultItems
                    });
                    list1.save();
                    res.redirect("/" + newList);
                } else{
                    //show existing list
                    res.render("list", {listTitle: findList.name, newListItems: findList.items});
                }
            }
        })
    }
})

app.post("/", function(req,res) {
    const item = req.body.newItem;
    const listName = req.body.list;
    const itemGet = new Item({
        name: item
    });
    if(listName === "Today"){
        itemGet.save();
        res.redirect("/");
    } else{
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(itemGet);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", function(req,res) {
    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.findByIdAndRemove(checkItemId, function(err) {
            if(err){
                console.log(err);
            } else{
                console.log("Succesfully deleted the checked item from collection.");
                res.redirect("/");
            }
        });
    } else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemId}}}, function(err,foundList) {
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }
})

// app.get("/about", function(req,res) {
//     res.render("about");
// })

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is working at port 3000");
})
