const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
let personSortNumber = false;
let personSortAlphabet = false;
let totalAmount;
let totalAmountOfPersons;
let personAmount ="";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const fs = require('fs')
let importData = JSON.parse(fs.readFileSync('names.json', 'utf-8'));
const port = 3000;

app.set('view engine', 'pug');

let persons = importData.names;


app.get("/", (req, res) => {
    res.render("personlist", {persons: persons, totalAmount : totalAmount, totalAmountOfPersons : totalAmountOfPersons, personAmount : personAmount });
})

app.get("/addperson", (req, res) => {
    res.render("addperson");
})

app.post("/addperson", (req, res) => {

    const newPerson = {name: req.body.name, amount: parseInt(req.body.amount)};
    console.log(typeof newPerson.amount)
    persons = [...persons, newPerson];
    res.redirect("/");
})
app.get("/sortPersonsByNumericalOrder", (req, res) => {
    if(personSortNumber == false){
    persons.sort( function( a, b ) {
        
        a = a.amount
        b = b.amount
        personSortNumber = true;
        return a > b ? -1 : a < b ? 1 : 0;


    });
    }
    else{
    persons.sort( function( a, b ) {
        
        a = a.amount
        b = b.amount
        personSortNumber = false         
        return a < b ? -1 : a > b ? 1 : 0;
    });
  }
    res.redirect("/");
  })

app.get("/sortPersonsByAlphabeticalOrder", (req, res) => {
    if(personSortAlphabet == false){
    persons.sort( function( a, b ) {
        
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        personSortAlphabet = true;
         return a < b ? -1 : a > b ? 1 : 0;

    });
    }
    else{
    persons.sort( function( a, b ) {
        
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        personSortAlphabet = false
         return a > b ? -1 : a < b ? 1 : 0;

    });
  }
    res.redirect("/");
  })

app.get("/amountOfAllNames", (req, res) => {
    for (name in persons) {
        if (persons.hasOwnProperty(name)) {
            totalAmountOfPersons++;
        }
    }
    totalAmountOfPersons = Object.keys(persons).length;
    console.log("Number of names " + totalAmountOfPersons);
    res.redirect("/");
  })


  app.get("/totalAmount", (req, res) => {

        totalAmount = persons.reduce(function(_this, val) {
            return _this + val.amount;
        }, 0);

    console.log("Total amount " + totalAmount);
    res.redirect("/");
  })

  app.get("/:name", (req, res) => {
    const personName = req.params.name;
    const person = persons.filter(person => person.name === personName);
    const personString = JSON.stringify(person)
    if (person.length > 0){
    personAmount = personName + "'s Amount is " + parsePerson(personString);       

    }
    else if(personName == "script.js" || personName == "favicon.ico"){
      
    }
    else{
      personAmount = personName +  " does not exist";
    }
    res.redirect("/")
  })
  function parsePerson(personToParse){
    let parsedPerson = "";
    let howManyis = 0;
    let howManyBraces = 0;

    for (i = 0; i < personToParse.length; i++) {
      if(personToParse[i] == "}"){
        howManyBraces++;
      }
      else if(howManyis == 2 && howManyBraces < 1 ){
        parsedPerson = parsedPerson + personToParse[i];
      }
      if(personToParse[i] == ":" ){
        howManyis++; 
    } 
    
  }
  return parsedPerson;
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${port}.`);
});