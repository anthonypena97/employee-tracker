const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../db/connection");
const { promise } = require("../db/connection");



class Menu {
	constructor() { }

	startMenu() {
		console.log(``);

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
					case 'updae an employee role':
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

	viewDepartments() {
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
				this.startMenu();
			}
		});
	}

	viewRoles() {
		const sql = `SELECT roles.id, roles.title, roles.salary,
			 departments.department_name AS department
             FROM roles 
             LEFT JOIN departments
             ON roles.department = departments.id
		`;

		db.query(sql, (err, rows) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`
				`);
				console.table(rows);
				this.startMenu();
			}
		});
	}

	viewEmployees() {
		const sql = `SELECT
		A.id, A.first_name AS first, 
		A.last_name AS last,
		roles.title,
		roles.salary,
		departments.department_name AS department,
		CONCAT(b.first_name, " ", b.last_name) AS manager

		FROM employees A
		
		LEFT JOIN roles ON A.role_title = roles.id
		LEFT JOIN departments ON roles.department = departments.id
		LEFT JOIN employees B ON A.manager_id = B.id
		`;

		db.query(sql, (err, rows) => {
			if (err) {
				console.log(err);
			} else {
				console.log(``);
				console.table(rows);
				this.startMenu();
			}
		});
	}

	addDepartment() {

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

	addRole() {

		inquirer
			.prompt(
				{
					type: "input",
					message: "What role would you like to add?",
					name: "role_add",
					validate: role_add => {
						if (role_add) {
							return true;
						} else {
							console.log('Please enter a role!');
							return false;
						}
					}
				}
			).then((result) => {

				const sql = `INSERT INTO roles (title) VALUES (?)`;
				const params = [result.role_add];

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

		let data = await this.databaseInfo();

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
					type: "input",
					message: "Who is your new employee's manager?",
					name: "manager",
					validate: manager => {
						if (manager) {
							return true;
						} else {
							console.log("Please enter your new employee's manager!");
							return false;
						}
					}
				}
			]).then((result) => {

				// SAVING RESULT TO SQL DATABASE

				// transformation for proper SQL syntax
				let departmentId = data.departments.indexOf(result.department) + 1
				let roleId = data.roles.indexOf(result.role) + 1

				const sql = `INSERT INTO employees (first_name, last_name, role_title, department, salary, manager) VALUES (?,?,?,?,?,?)`;
				const params = [result.first_name, result.last_name, roleId, departmentId, result.salary, result.manager];

				db.query(sql, params, (err, rows) => {
					if (err) {
						console.log(err);
					} else {
						this.viewEmployees();
					}

				});

			});

	}

	updateRole() {
		console.log('departments');
	}

	databaseInfo() {

		return new Promise(resolve => {

			let departmentsArr = [];

			let rolesArr = [];

			const collectDepartments = new Promise(resolve => {

				// COLLECT DEPARTMENT OPTIONS
				const sql = `SELECT * FROM departments`;


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
				const sql = `SELECT * FROM roles`;


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

			collectDepartments.then(() => {
				collectRoles.then(() => {

					let data = {
						'departments': departmentsArr,
						'roles': rolesArr
					}

					resolve(data);


				})
			});


		})

	}

	exit() {
		console.log('departments');
	}
}

module.exports = { Menu };
