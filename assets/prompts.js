const startMenu = [
    {
        message: "What would you like to do? \n\n",
        name: "options",
        type: 'list',
        choices: ["View all departments",
                    "View all roles",
                    "View all employees",
                    "View all employees by manager",
                    "View all employees by department",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Update an employee manager",
                    "Exit"
                ],
        loop: true,
        waitUserInput: true
    }
]

module.exports = (startMenu);
