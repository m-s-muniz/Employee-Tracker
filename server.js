const inquirer = require("inquirer");
const ctable = require("console.table");
const prompts = require("./assets/prompts");
const db = require('./assets/connection');
// console.log(db);
// db.end();

async function init(){
    console.log('Starting.....');
    await inquirer.prompt(prompts)
    .then(answers =>{
         console.log(answers);
            switch(answers.options){
                case "View all departments":
                    console.log('viewing departments');
                    break;
                case "View all roles":
                    console.log('viewing roles');
                    break;
                case "View all employees":
                    console.log('viewing employees');
                    break;
                case "Add a department":
                    console.log('adding a department');
                    break;
                case "Add a role":
                    console.log('Adding a role');
                    break;
                case "Add an employee":
                    console.log('Adding an Employee');
                    break;
                case "Update an employee role":
                    console.log('Updating employee role');
                    break;



                default:
                     console.log('Exiting program');
                break;
                        

            }
        });
}
(async ()=> {
    await init();
    db.end();

})();



