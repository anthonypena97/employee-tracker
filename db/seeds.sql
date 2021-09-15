INSERT INTO departments (department_name)
VALUES
  ('Marketing'),
  ('Product'),
  ('Customer Service'),
  ('Graphic Design');

INSERT INTO roles (title, department, salary)
VALUES
  ('Senior Marketer', 1, 100000),
  ('Jr Graphic Designer', 4, 70000),
  ('Product Intern', 2, 60000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('David', 'Peterson', 1, 1),
  ('Teresa', 'Sandoval', 2, null),
  ('Jenna', 'Gomez', 1, 2),
  ('Estefan', 'Trinao', 3, 2),
  ('Gepetto', 'Montoya', 3, 1);