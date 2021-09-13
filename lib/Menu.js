const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../db/connection");


class Menu {
	constructor() { }

	startMenu() {
		console.log(``);

		inquirer
			.prompt({
				type: 'list',
				name: "menu",
				message: 'Would you like to generate a web page for your team?',
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
		const sql = `SELECT * FROM departments`;

		db.query(sql, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			} else {
				console.log(`
				`);
				console.table(rows);
				this.startMenu();
			}
		});
	}

	viewRoles() {
		const sql = `SELECT * FROM roles`;

		db.query(sql, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			} else {
				console.log(`
				`);
				console.table(rows);
				this.startMenu();
			}
		});
	}

	viewEmployees() {
		const sql = `SELECT * FROM employees`;

		db.query(sql, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			} else {
				console.log(`
				`);
				console.table(rows);
				this.startMenu();
			}
		});
	}

	addDepartments() {
		console.log('departments');
	}

	addRole() {
		console.log('departments');
	}

	viewEmployee() {
		console.log('departments');
	}

	updateRole() {
		console.log('departments');
	}

	exit() {
		console.log('departments');
	}
}

module.exports = { Menu };
