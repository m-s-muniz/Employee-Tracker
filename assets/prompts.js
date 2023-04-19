const startMenu = [
    {
        message: "What would you like to do? \n\n",
        name: "options",
        type: 'list',
        choices: ["View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Exit"
                ],
        loop: true,
        waitUserInput: true
    }
]

module.exports = (startMenu);
