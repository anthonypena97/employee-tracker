// const mysql = require("mysql2");
const db = require("./db/connection");
const { Menu } = require("./lib/Menu");


console.log(`           
           __________                           
         .'----------'.                              
         | .--------. |                             
         | |########| |       __________              
         | |########| |      |__________|             
.--------| '--------' |------|    --=-- |-------------.
|        '----,-.-----'      |o ======  |             | 
|       ______|_|_______     |__________|             | 
|      |  %%%%%%%%%%%%  |                             | 
|      |  %%%%%%%%%%%%% |                             | 
|      ^^^^^^^^^^^^^^^^^^                             | 
+-----------------------------------------------------+
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

=======================================================
=============== EMPLOYEE MANAGMENT SYSTEM =============
=======================================================
`);

const dataBase = new Promise((resolve, reject) => {
  db.connect(function (err) {
    if (err) throw err;

  });
  resolve('Successfully connected to database............')
})

// ========================= APPLICATION LOGIC =========================

// INITIALIZING DATABASE
dataBase
  .then((connection) => console.log(connection))

  // STARTS COMMAND LINE APPLICATION
  .then(() => new Menu().startMenu());
