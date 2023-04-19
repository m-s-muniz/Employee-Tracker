const inquirer = require("inquirer");
const ctable = require("console.table");
const prompts = require("./assets/prompts");
const db = require('./assets/connection');
// console.log(db);
// db.end();



async function init(){
    console.log('Starting.....');
    db.connect(function(err) {
        if (err) throw err;
        // console.log("Connection established.");
        
    }
    );
    await inquirer.prompt(prompts)
    .then(answers =>{
        //  console.log(answers);
            switch(answers.options){
                case "View all departments": 
                console.log('');
                console.log('viewing departments');
                console.log('');
                viewDepts();
                    break;

                case "View all roles": 
                console.log('');
                console.log('viewing roles');
                console.log('');
                viewRoles();
                    break;

                case "View all employees":         
                console.log('');                 
                console.log('viewing employees');
                console.log('');
                viewEmployees();
                    break;

                case "Add a department": 
                console.log('');
                console.log('adding a department');
                console.log('');
                addDept();
                    break;

                case "Add a role":
                console.log('');
                console.log('Adding a role');
                console.log('');
                addRole();
                    break;

                case "Add an employee":
                    console.log('Adding an Employee');
                    break;

                case "Update an employee role":
                    console.log('Updating employee role');
                    break;



                default:
                     console.log('Exiting program');
                     db.end();
                break;
                        

            }
        });
}




const viewDepts = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
};

const viewRoles = () => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        err ? console.error(err) : console.table(results);
         init();
        })
    };
    
    const viewEmployees = () => {
        db.query(`SELECT * FROM employees`, (err, results) => {
            err ? console.error(err) : console.table(results);
            init();
        })
    };
    
    const addDept = () => {
        inquirer.prompt([

                {
                    type: "input",
                    message: "What is the name of the department you'd like to add?",
                    name: "addDept"
                }
            ]).then(ans => {
                db.query(`INSERT INTO department(name)
                        VALUES(?)`, ans.addDept, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        db.query(`SELECT * FROM department`, (err, results) => {
                            err ? console.error(err) : console.table(results);
                            init();
                        })
                    }
                }
                )
            })
    };



    const addRole = () => {
         db.promise().query('SELECT name, id as value FROM department')
        .then( ([rows,fields]) => {
            if(rows.length === 0){
                console.log('Cannot add a role because no departments are available for the role.');
                return;
            }else{
                //console.log(rows);
    
                inquirer.prompt([{
                    type: 'input',
                    message: "What is the title of the role you'd like to add?",
                    name: 'roleName',
            
                },
                {
                    type: 'input',
                    message: "What is the salary for this role?",
                    name: 'salary',
            
                },
                {
                    type: 'list',
                    message: "Which department is this role in?",
                    name: 'deptID',
                    choices: rows
                }])
                .then(answers => {
                    console.log(answers);
                    db.execute('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
                    [answers.roleName, answers.salary, answers.deptID], 
                    function(err, results,fields){
                        if(err){
                            console.error(err);
                        }
                        //console.log(results);
                        //console.log(fields);
                    });

                    init();
                });
            }
        });    
    }

    
    


    
    
    (async ()=> {
        await init();
        
    })();
    