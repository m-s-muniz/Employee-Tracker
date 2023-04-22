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
        
                case "Delete a department":
                console.log('');
                console.log('Deleting a department');
                console.log('');
                      deleteDepartment();
                           break;

                case "Delete a role":
                console.log('');
                console.log('Deleting a role');
                console.log('');
                      deleteRole();
                            break;
            
                case "Delete an employee":
                console.log('');
                console.log('Deleting an employee');
                console.log('');
                      deleteEmployee();
                           break;

                case "View budget":
                console.log('');
                console.log('Viewing the budget');
                console.log('');
                      viewBudget();
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

      
          const [rows, fields] = await db.promise().query('SELECT title as name, id as value FROM roles');

      
          if (rows.length === 0) {
            console.log('\n\n');
            console.log('Cannot add an employee because no roles are available.');
            return;
          }
      
          roleOptions = rows;
      
          let employeeOptions = [];

      
          const [rows2, fields2] = await db.promise().query('SELECT CONCAT(first_name, " ", last_name) as name, id as value FROM employees');

      
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
    
      const deleteDepartment = () => {
      let existing;
      let deleteable;
  
      db.promise().query(`SELECT id, name as 'Department Name' FROM department`)
      .then( ([rows, fields]) => {
          if(rows.length === 0){
              console.log('\n\n');
              console.log(kleur.red('There are no results.'));
          }else{
              console.log('\n\n');
              console.table(rows);
              existing = rows;
              return existing;
          }
      });
  
           inquirer.prompt(
          {
              type:'number',
              message:'Which department do you want to delete. (number only)',
              name: 'departmentID',
              choices: existing
          }
      )
      .then((answers) =>{
          //console.log(answers);
          deleteable = answers.departmentID
          db.execute('DELETE FROM department WHERE id = ?',
          [deleteable], 
          function(err, results,fields){
              if(err){
                  console.error(err);
              }
              console.log('\n\n');
              //console.log(results);
              //console.log(fields);
              console.log('Department has been deleted.');
      });
      db.unprepare();
      init();
      });
  
 
  
  }

    
    const deleteRole = () => {
    let existing;
    let deleteable;

    db.promise().query(`SELECT 
        r.id, 
        r.title, 
        r.salary,
        CONCAT(e.first_name, ' ', e.last_name) AS 'Assigned Employee'
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        ORDER BY r.id`)
    .then( ([rows, fields]) => {
        if(rows.length === 0){
            console.log('\n\n');
            console.log(kleur.red('There are no results.'));
        }else{
            console.log('\n\n');
            console.table(rows);
            existing = rows;
            return existing;
        }
    });

    inquirer.prompt(
        {
            type:'number',
            message:'Which role do you want to delete. (number only)',
            name: 'roleID',
            choices: existing
        }
    )
    .then((answers) =>{
        //console.log(answers);
        deleteable = answers.roleID;
        db.execute('DELETE FROM roles WHERE id = ?',
        [deleteable], 
        function(err, results,fields){
            if(err){
                console.error(err);
            }
            console.log('\n\n');
            //console.log(results);
            //console.log(fields);
            console.log('Role has been deleted.');
    });
    db.unprepare();
    init();
    });



}

  const deleteEmployee = () => {
    let existing;
    let deleteable;

      db.promise().query(`SELECT 
        e.id,
        CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name', 
        r.title, 
        r.salary,
        CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager Name'
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        LEFT JOIN employees e2 ON e2.manager_id = e.id
        ORDER BY e.id`)
    .then( ([rows, fields]) => {
        if(rows.length === 0){
            console.log('\n\n');
            console.log(kleur.red('There are no results.'));
        }else{
            console.log('\n\n');
            console.table(rows);
            existing = rows;
            return existing;
        }
    });

        inquirer.prompt(
        {
            type:'number',
            message:'Which employee do you want to delete. (number only)',
            name: 'employeeID',
            choices: existing
        }
    )
    .then((answers) =>{
        //console.log(answers);
        deleteable = answers.employeeID;
        db.execute('DELETE FROM employees WHERE id = ?',
        [deleteable], 
        function(err, results,fields){
            if(err){
                console.error(err);
            }
            console.log('\n\n');
            //console.log(results);
            //console.log(fields);
            console.log('Employee has been deleted.');
    });
    db.unprepare();
    init();
    });



}

    const viewBudget = () =>{
    db.promise().query(`SELECT 
      d.name AS 'Department',
      SUM(r.salary) AS 'Budget'
      FROM roles r 
      JOIN department d ON r.department_id = d.id 
      GROUP BY d.name`)
  .then( ([rows,fields]) => {
      if(rows.length === 0){
          console.log('\n\n');
          console.log('There are no results.');
      }else{
          console.log('\n\n');
          console.table(rows);
      }
      init();
  });
}


    
    (async ()=> {
        await init();
        
    })();

    


