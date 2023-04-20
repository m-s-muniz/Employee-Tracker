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
                console.log('Viewing departments');
                console.log('');
                viewDepts();
                    break;

                case "View all roles": 
                console.log('');
                console.log('Viewing roles');
                console.log('');
                viewRoles();
                    break;

                case "View all employees":         
                console.log('');                 
                console.log('Viewing employees');
                console.log('');
                viewEmployees();
                    break;

                    
                case "View all employees by manager":         
                console.log('');                 
                console.log('Viewing employees by manager');
                console.log('');
                viewByManager();
                    break;

                case "View all employees by department":         
                console.log('');                 
                console.log('Viewing employees by department');
                console.log('');
                viewByDepartment();
                    break;
                



                case "Add a department": 
                console.log('');
                console.log('Adding a department');
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
                console.log('');
                console.log('Adding an Employee');
                console.log('');
                // addEmployee();
                    break;

                case "Update an employee role":
                console.log('');
                console.log('Updating Employee Role');
                console.log('');
                // updateEmployeeRole();
                    break;





                default:
                console.log('');
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
                console.log('Cannot add a role, no departments exits for the role.');
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
                        //console.log(rows);
                        //console.log(fields);
                    });

                    init();
                });
            }
        });    
    }


    

    // const addEmployee = () => {
    //      db.promise().query('SELECT id, title From roles')
    //     .then( ([rows,fields]) => {
    //         if(rows.length === 0){
    //             console.log('Cannot add an employee.');
    //             return;
    //         }else{
    //             //console.log(rows);
    
    //             inquirer.prompt([{
    //                 type: "input",
    //                 message: "What is the employee's first name?",
    //                 name: "firstName"
            
    //             },
    //             {
    //                 type: "input",
    //                 message: "What is the employee's last name?",
    //                 name: "lastName"
            
    //             },
    //             {
    //                 type: "list",
    //                 message: "What is the employee's role?",
    //                 name: "employeeRole",
    //                 choices: rollChoices
    //             }])
    //             .then(answers => {
    //                 console.log(answers);
    //                 db.execute('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
    //                 [answers.roleName, answers.salary, answers.deptID], 
    //                 function(err, results,fields){
    //                     if(err){
    //                         console.error(err);
    //                     }
    //                     //console.log(rows);
    //                     //console.log(fields);
    //                 });

    //                 init();
    //             });
    //         }
    //     });    
    // }

    const viewByManager = () => {
        db.promise().query("SELECT CONCAT(m.first_name, ' ',  m.last_name) AS manager, e.id, e.first_name, e.last_name FROM employees e JOIN employees m ON e.manager_id = m.id WHERE e.manager_id IS NOT NULL")
        .then( ([rows,fields]) => {
            if(rows.length === 0){
                console.log('There are no results.');
            }else{
                console.table(rows);
            }
            init();
        });
    }
    

    const viewByDepartment = () => {
        db.promise().query("SELECT d.name AS `Department`, CONCAT(e.first_name,' ', e.last_name) AS Employee, r.title FROM employees e JOIN roles r ON r.id = e.role_id JOIN department d ON d.id = r.department_id ORDER BY d.name, r.title")
        .then( ([rows,fields]) => {
            if(rows.length === 0){
                console.log('There are no results.');
            }else{
                console.table(rows);
            }
            init();
        });
    }
    
    
    
    (async ()=> {
        await init();
        
    })();
    