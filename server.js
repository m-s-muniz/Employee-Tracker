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
                addEmployee();
                    break;

                case "Update an employee role":
                console.log('');
                console.log('Updating Employee Role');
                console.log('');
                updateEmployeeRole();
                    break;

                case "Update an employee manager":
                console.log('');
                console.log('Updating Employee Manager');
                console.log('');
                updateEmployeeManager();
                     break;
        





                default:
                console.log('');
                console.log('Exiting program');
                db.end();
                break;
                        

            }
        });
}


    // View Departments

    const viewDepts = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
};
    // View Roles
    const viewRoles = () => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        err ? console.error(err) : console.table(results);
         init();
        })
    };
    // View Employees
    const viewEmployees = () => {
        db.query(`SELECT * FROM employees`, (err, results) => {
            err ? console.error(err) : console.table(results);
            init();
        })
    };

    // Add a Department
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

        // Add a Role

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
      // Add employee
    addEmployee = async () => {
        try {
          let roleOptions = [];
          console.log('\n\n');
          console.log('Retrieving role options...');
      
          const [rows, fields] = await db.promise().query('SELECT title as name, id as value FROM roles');
          console.log('\n\n');
          console.log('Role options:', rows);
      
          if (rows.length === 0) {
            console.log('\n\n');
            console.log('Cannot add an employee because no roles are available.');
            return;
          }
      
          roleOptions = rows;
      
          let employeeOptions = [];
          console.log('\n\n');
          console.log('Retrieving employee options...');
      
          const [rows2, fields2] = await db.promise().query('SELECT CONCAT(first_name, " ", last_name) as name, id as value FROM employees');
          console.log('\n\n');
          console.log('Employee options:', rows2);
      
          const noneManager = { name: 'None', value: null };
          employeeOptions = [...rows2, noneManager];
      
          const answers = await inquirer.prompt([
            {
              type: 'input',
              message: "What is the employee's first name?",
              name: 'firstName',
            },
            {
              type: 'input',
              message: "What is the employee's last name?",
              name: 'lastName',
            },
            {
              type: 'list',
              message: "What is the employee's role?",
              name: 'roleID',
              choices: roleOptions,
            },
            {
              type: 'list',
              message: "Who is this employee's manager?",
              name: 'managerID',
              choices: employeeOptions,
            },
          ]);
      
          console.log('\n\n');
          console.log('Adding employee to database...');
          await db.promise().execute(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [answers.firstName, answers.lastName, answers.roleID, answers.managerID]
          );
          console.log('\n\n');
          console.log('Employee added successfully!');
        } catch (err) {
          console.log('\n\n');
          console.error(err);
        }
        init();
      }


      // Update an employee role
    updateEmployeeRole = () => {
    inquirer.prompt([
      {
        name: "employeeID",
        type: "number",
        message: "Please enter the employee id associated with the employee you want to update role in the database. Enter ONLY numbers."
      },
      {
        name: "newRoleID",
        type: "number",
        message: "Please enter the new role number id associated with the employee you want to update in the database. Enter ONLY numbers."
      }
    ]).then(function (response) {
      // Update the employee's role in the database
      const updateQuery = `UPDATE employees SET role_id = ? WHERE id = ?`;
      db.query(updateQuery, [response.newRoleID, response.employeeID], function (err, data) {
        if (err) throw err;
        console.log(`The employee with ID ${response.employeeID} has been updated to the new role with ID ${response.newRoleID} successfully.`);
  
        // Show the updated list of employees
        const selectQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary FROM employees e JOIN roles r ON e.role_id = r.id JOIN department d ON r.department_id = d.id`;
        db.query(selectQuery, (err, result) => {
          if (err) {
            console.error(err);
            init();
            return;
          }
          console.table(result);
          init();
        });
      });
    });
  };



        // Update employee manager
        updateEmployeeManager = () => {
        inquirer.prompt([
      {
        name: "employeeID",
        type: "number",
        message: "Please enter the employee id associated with the employee you want to update role in the database. Enter ONLY numbers."
      },
      {
        name: "newManagerID",
        type: "number",
        message: "Please enter the new manager id associated with the employee you want to update in the database. Enter ONLY numbers."
      }
    ]).then(function (response) {
      // Update the employee's manager in the database
      const updateQuery = `UPDATE employees SET manager_id = ? WHERE id = ?`;
      db.query(updateQuery, [response.employeeID, response.newManagerID], function (err, data) {
        if (err) throw err;
        console.log(`The employee with ID ${response.employeeID} has been updated to the new role with ID ${response.newManagerID} successfully.`);
  
        // Show the updated list of employees
        const selectQuery = `SELECT e.id, e.first_name, e.last_name, e.role_id, r.title, CONCAT(e2.first_name, ' ',e2.last_name) AS manager FROM employees e LEFT JOIN roles r on e.role_id = r.id LEFT JOIN employees e2 ON e2.manager_id = e.id`;
        db.query(selectQuery, (err, result) => {
          if (err) {
            console.error(err);
            init();
            return;
          }
          console.table(result);
          init();
        });
      });
    });
  };





        // View employee by manager

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
        // View employee by department

    const viewByDepartment = () => {
        db.promise().query("SELECT d.name AS Department, CONCAT(e.first_name,' ', e.last_name) AS Employee, r.Title FROM employees e JOIN roles r ON r.id = e.role_id JOIN department d ON d.id = r.department_id ORDER BY d.name, r.title")
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
    


