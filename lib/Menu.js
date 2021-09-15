const inquirer = require("inquirer");
const table = require("console.table");
const db = require("../db/connection");
const { promise } = require("../db/connection");



class Menu {
	constructor() { }

	startMenu() {

		console.log(`    ===========================================
    ------------------ MENU -------------------
    ===========================================
		`)

		inquirer
			.prompt({
				type: 'list',
				name: "menu",
				message: 'What would you like to do?',
				choices: [
					'view all departments',
					'view all roles',
					'view all employees',
					new inquirer.Separator(),
					'add a department',
					'add a role',
					'add an employee',
					new inquirer.Separator(),
					'update an employee role',
					new inquirer.Separator(),
					'exit'
				],
				loop: false
			}).then((data) => {
				switch (data.menu) {
					case 'view all departments':
						this.viewDepartments();
						break;
					case 'view all roles':
						this.viewRoles();
						break;
					case 'view all employees':
						this.viewEmployees();
						break;
					case 'add a department':
						this.addDepartment();
						break;
					case 'add a role':
						this.addRole();
						break;
					case 'add an employee':
						this.addEmployee();
						break;
					case 'update an employee role':
						this.updateRole();
						break;
					case 'exit':
						this.exit();
						break;
					default:
						console.log("Please choose an option!");
						break;
				}
			});
	}

	viewDepartments(return_menu) {
		const sql = `SELECT departments.id, departments.department_name AS department
		FROM departments
		ORDER BY id
		`;

		db.query(sql, (err, rows) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`
				`);
				console.table(rows);
				// if function is passed a return_menu, then function 
				if (return_menu === false) {


				} else {

					this.startMenu();

				}
			}
		});
	}

	viewRoles(return_menu) {
		const sql = `SELECT roles.id, roles.title, roles.salary,
			 departments.department_name AS department
             FROM roles 
             LEFT JOIN departments
             ON roles.department = departments.id
			 ORDER by id
		`;

		db.query(sql, (err, rows) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`
				`);
				console.table(rows);
				// if function is passed a return_menu, then function 
				if (return_menu === false) {


				} else {

					this.startMenu();

				}
			}
		});
	}

	viewEmployees(return_menu) {

		const sql = `SELECT
		A.id, A.first_name AS first, 
		A.last_name AS last,
		roles.title,
		roles.salary,
		departments.department_name AS department,
		CONCAT(b.first_name, " ", b.last_name) AS manager

		FROM employees A
		
		LEFT JOIN roles ON A.role_id = roles.id
		LEFT JOIN departments ON roles.department = departments.id
		LEFT JOIN employees B ON A.manager_id = B.id
		ORDER by id
		`;

		db.query(sql, (err, rows) => {
			if (err) {
				console.log(err);
			} else {
				console.log(``);
				console.table(rows);

				// if function is passed a return_menu, then function 
				if (return_menu === false) {


				} else {

					this.startMenu();

				}

			}
		});
	}

	async addDepartment() {

		// displays current employees using function, without returning user to menu
		this.viewDepartments(false);

		let data = await this.databaseInfo();

		inquirer
			.prompt(
				{
					type: "input",
					message: "What department would you like to add?",
					name: "department_add",
					validate: department_add => {
						if (department_add) {
							return true;
						} else {
							console.log('Please enter a department!');
							return false;
						}
					}
				}
			).then((result) => {

				const sql = `INSERT INTO departments (department_name) VALUES (?)`;
				const params = [result.department_add];

				db.query(sql, params, (err, rows) => {
					if (err) {
						console.log(err);
					} else {
						this.viewDepartments();
					}

				});

			});
	}

	async addRole() {

		// calls function for displaying current roles, but does not return the menu
		this.viewRoles(false);

		let data = await this.databaseInfo();

		inquirer
			.prompt([
				{
					type: "input",
					message: "What is the title for the role you're adding?",
					name: "title_add",
					validate: title_add => {
						if (title_add) {
							return true;
						} else {
							console.log('Please enter a role!');
							return false;
						}
					}
				},
				{
					type: "input",
					message: "What is the role salary? (enter numbers only)",
					name: "salary_add",
					validate: salary_add => {
						if (salary_add) {
							return true;
						} else {
							console.log('Please enter your new role salary!');
							return false;
						}
					}
				},
				{
					type: "list",
					message: "What department does this role pertain to?",
					name: "dept_add",
					choices: data.departments
				}
			]).then((result) => {

				// transformation for proper SQL syntax
				let departmentId = data.departments.indexOf(result.dept_add) + 1

				const sql = `INSERT INTO roles (title, department, salary) VALUES (?,?,?)`;
				const params = [result.title_add, departmentId, result.salary_add];

				db.query(sql, params, (err, rows) => {
					if (err) {
						console.log(err);
					} else {
						this.viewRoles();
					}

				});

			});
	}

	async addEmployee() {

		// displays current employees using viewEmployees function without returning user to menu
		this.viewEmployees(false);

		let data = await this.databaseInfo();

		// adds the option for none in employees data
		data.employees.push("None");

		inquirer
			.prompt([
				{
					type: "input",
					message: "What is your employees first name?",
					name: "first_name",
					validate: first_name => {
						if (first_name) {
							return true;
						} else {
							console.log('Please enter a first name!');
							return false;
						}
					}
				},
				{
					type: "input",
					message: "What is your employees last name?",
					name: "last_name",
					validate: last_name => {
						if (last_name) {
							return true;
						} else {
							console.log('Please enter a last name!');
							return false;
						}
					}
				},
				{
					type: "list",
					message: "What is your new employee's role?",
					name: "role",
					choices: data.roles
				},
				{
					type: "list",
					message: "Who is your new employee's manager?",
					name: "manager",
					choices: data.employees
				}
			]).then((result) => {

				// SAVING RESULT TO SQL DATABASE

				// transformation for proper SQL syntax
				let roleId = data.roles.indexOf(result.role) + 1
				let managerId;

				if (result.manager === "None") {

					managerId = null;

				} else {

					managerId = data.employees.indexOf(result.manager) + 1

				}

				const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
				const params = [result.first_name, result.last_name, roleId, managerId];

				db.query(sql, params, (err, rows) => {
					if (err) {
						console.log(err);
					} else {
						this.viewEmployees();
					}

				});

			});

	}

	async updateRole() {

		// calls function for displaying current roles, but does not return the menu
		this.viewRoles(false);

		let data = await this.databaseInfo();

		inquirer
			.prompt([
				{
					type: "list",
					message: "Which employee would you like to update role?",
					name: "employee",
					choices: data.employees
				},
				{
					type: "list",
					message: "Which role will you be assigning?",
					name: "role",
					choices: data.roles
				}
			]).then((result) => {

				// SAVING RESULT TO SQL DATABASE

				// transformation for proper SQL syntax
				let roleId = data.roles.indexOf(result.role) + 1
				let employeeId = data.employees.indexOf(result.employee) + 1

				console.log(roleId);
				console.log(employeeId);

				const sql = `
				UPDATE employees 
				SET role_id = ? 
				WHERE id = ?`;

				const params = [roleId, employeeId];

				db.query(sql, params, (err, rows) => {
					if (err) {
						console.log(err);
					} else {
						this.viewEmployees();
					}

				});

			});

	}

	databaseInfo() {

		return new Promise(resolve => {

			let departmentsArr = [];
			let rolesArr = [];
			let employeesArr = [];

			const collectDepartments = new Promise(resolve => {

				// COLLECT DEPARTMENT OPTIONS
				const sql = `
				SELECT * FROM departments
				ORDER by id
				`;


				db.query(sql, (err, rows) => {
					if (err) {
						console.log(err);
					} else {

						for (let i = 0; i < rows.length; i++) {
							departmentsArr.push(rows[i].department_name);
						};

						resolve();

					}

				});

			})


			const collectRoles = new Promise((resolve) => {

				// COLLECT ROLE OPTIONS
				const sql = `
				SELECT * FROM roles
				ORDER by id
				`;


				db.query(sql, (err, rows) => {
					if (err) {
						console.log(err);
					} else {

						for (let i = 0; i < rows.length; i++) {
							rolesArr.push(rows[i].title);
						};

						resolve();

					}

				});
			});

			const collectEmployees = new Promise((resolve) => {

				// COLLECT ROLE OPTIONS
				const sql = `
				SELECT 
				CONCAT(first_name, " ", last_name) AS manager
				FROM employees
				ORDER by id
				`;


				db.query(sql, (err, rows) => {
					if (err) {
						console.log(err);
					} else {

						for (let i = 0; i < rows.length; i++) {
							employeesArr.push(rows[i].manager);
						};

						// employeesArr.push("None")

						resolve();

					}

				});
			});

			collectDepartments.then(() => {
				collectRoles.then(() => {
					collectEmployees.then(() => {

						let data = {
							'departments': departmentsArr,
							'roles': rolesArr,
							'employees': employeesArr
						}

						resolve(data);
					})

				})
			});


		})

	}

	exit() {
		console.log('SEE YA!');
		process.exit();
	}
}

module.exports = { Menu };
