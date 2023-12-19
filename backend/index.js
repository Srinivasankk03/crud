// import mysql from "mysql";
// import cors from "cors";
//import express from "express";

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "test@123",
//   database: "test",
// });

// app.get("/", (req, res) => {
//   res.json("hello this is the backend");
// });

// //ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'test@123';

// app.use(express.json());
// app.use(cors());

// app.get("/books", (req, res) => {
//   const q = "SELECT * FROM books";
//   db.query(q, (err, data) => {
//     if (err) return res.json(err);

//     return res.json(data);
//   });
// });

// app.post("/books", (req, res) => {
//   const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)";
//   const values = [
//     req.body.title,
//     req.body.desc,
//     req.body.price,
//     req.body.cover,
//   ];

//   db.query(q, [values], (err, data) => {
//     if (err) return res.json(err);

//     return res.json("books has been created successfully");
//   });
// });

// app.delete("/books/:id", (req, res) => {
//   const bookId = req.params.id;
//   const q = "DELETE FROM books WHERE id=?";

//   db.query(q, [bookId], (err, data) => {
//     if (err) return res.json(err);

//     return res.json("books has been deleted successfully");
//   });
// });

// app.put("/books/:id", (req, res) => {
//   const bookId = req.params.id;
//   const q =
//     "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id=?";

//   const values = [
//     req.body.title,
//     req.body.desc,
//     req.body.price,
//     req.body.cover,
//   ];

//   db.query(q, [...values, bookId], (err, data) => {
//     if (err) return res.json(err);

//     return res.json("books has been updated successfully");
//   });
// });
// app.listen(8800, () => {
//   console.log("connected to backend!");
// });
//

// server.js

// import express from "express";
// import bodyParser from "body-parser";
// import mysql from "mysql";

// const app = express();
// const port = 8800;

// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "test@123",
//   database: "test",
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL");
// });

// app.use(bodyParser.json());

// // API endpoint to insert data
// app.post("/upload", (req, res) => {
//   const jsonDataArray = req.body;

//   // Insert data into the database
//   const sql = "INSERT INTO your_table_name SET ?";
//   jsonDataArray.forEach((jsonData) => {
//     db.query(sql, jsonData, (err) => {
//       if (err) {
//         console.error("Error inserting data:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }
//     });
//   });

//   res.status(200).json({ message: "Data inserted successfully" });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// server.js

// import express from "express";
// import bodyParser from "body-parser";
// import mysql from "mysql2/promise";
// import cors from "cors";

// const app = express();
// const port = 8800;
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());

// // MySQL database configuration
// const dbConfig = {
//   host: "localhost",
//   user: "root",
//   password: "test@123",
//   database: "test",
// };

// app.get("/books", (req, res) => {
//   const q = "SELECT * FROM books";
//   dbConfig.query(q, (err, data) => {
//     if (err) return res.json(err);

//     return res.json(data);
//   });
// });

// // Endpoint to handle Excel data upload
// app.post("/upload", async (req, res) => {
//   const excelData = req.body;

//   try {
//     // Connect to MySQL database
//     const connection = await mysql.createConnection(dbConfig);

//     // Insert Excel data into MySQL
//     for (const row of excelData) {
//       const { title, desc, price, cover } = row;
//       await connection.execute(
//         "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?, ?, ?, ?)",
//         [title, desc, cover, price]
//       );
//     }

//     // Close the database connection
//     connection.end();

//     res.status(200).json({ message: "Data successfully saved to MySQL." });
//   } catch (error) {
//     console.error("Error saving data to MySQL:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const port = 8800;

app.use(cors());
app.use(express.json({ limit: "50000000kb" }));

// MySQL database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "test@123",
  database: "test",
};

// Function to check if the table exists
const tableExists = async (connection, tableName) => {
  const [rows] = await connection.execute(
    "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?",
    [dbConfig.database, tableName]
  );

  return rows[0].count > 0;
};

// Function to create the table if it doesn't exist
const createTableIfNeeded = async (connection, tableName) => {
  const doesTableExist = await tableExists(connection, tableName);

  if (!doesTableExist) {
    // Create the table with your desired schema
    await connection.execute(
      `CREATE TABLE ${tableName} (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`title\` VARCHAR(45) NOT NULL,
      \`desc\` VARCHAR(245) NOT NULL,
      \`cover\` VARCHAR(45) NOT NULL,
      \`price\` INT NULL,
      PRIMARY KEY (\`id\`)
    )`
    );
  }
};

// app.get("/books", async (req, res) => {
//   const q = "SELECT * FROM books";
//   try {
//     // Connect to MySQL database
//     const connection = await mysql.createConnection(dbConfig);

//     // Execute the query
//     const [rows] = await connection.execute(q);

//     // Close the database connection
//     connection.end();

//     res.json(rows);
//   } catch (error) {
//     console.error("Error retrieving data from MySQL:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Endpoint to handle Excel data upload
app.post("/upload", async (req, res) => {
  const { excelData } = req.body;
  const { table } = req.query;

  if (!table || !Array.isArray(excelData)) {
    return res.status(400).json({
      error:
        "Invalid request. Provide table name and excelData in the request.",
    });
  }

  try {
    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Create the table if it doesn't exist
    await createTableIfNeeded(connection, table);

    // Insert Excel data into MySQL
    // for (const row of excelData) {
    //   const { title, desc, price, cover } = row;
    //   await connection.execute(
    //     "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?, ?, ?, ?)",
    //     [title, desc, cover, price]
    //   );
    // }
    // for (const row of excelData) {
    //   const columns = (`title`, `desc`, `cover`, `price`);
    //   const values = Object.values(row);
    //   const placeholders = Array(values.length).fill("?").join(",");

    //   await connection.execute(
    //     `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    //     values
    //   );
    // }
    // for (const row of excelData) {
    //   const columns = "`title`, `desc`, `cover`, `price`";
    //   const values = Object.values(row);
    //   const placeholders = Array(values.length).fill("?").join(",");

    //   await connection.execute(
    //     `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    //     values
    //   );
    // }
    for (const row of excelData) {
      const columns = "`title`, `desc`, `cover`, `price`";
      const values = Object.values(row);
      const placeholders = Array(values.length).fill("?").join(",");

      await connection.execute(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values
      );
    }
    // Close the database connection
    connection.end();

    // res.status(200).json({ message: "Data successfully saved to MySQL." });
    res
      .status(200)
      .json({ message: `Data successfully saved to table ${table}.` });
  } catch (error) {
    console.error("Error saving data to MySQL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
