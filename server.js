const express = require('express');
const connection = require('./config');

const PORT = process.env.PORT || 3001;

const app = express();

// Turn on body parser
// Makes req.body exist
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Post - create todo
// async await
// Declaring a function as "async" allows us to use "await" syntax inside the function
app.post('/api/todos', async (req, res) => {
    const {task} = req.body;

    // If the user does not provide a task, respond with an error
    if (!task) {
        return res.status(400).json({error: 'You must provide a task'});
    }

    try {
        const insertQuery = 'INSERT INTO todos(task) VALUES(?);';
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';

        // Destructure the mysql result to only get first index only
        const [result] = await connection.query(insertQuery, [task]);

        // Whenever we do an INSERT, UPDATE, or DELETE query in mysql2 or mysql npm package
        // it doesn't give us the data that was interacted with, it instead tells us information
        // about how many rows were affected and maybe the insertId or updateId of the regarding data
        // It also gives us an array with 2 elements. The 1st one is an object where we have the information we need
        // 2nd one is null or information about the fields of that row

        const [todosResult] = await connection.query(getTodoById, [result.insertId]);

        res.json(todosResult);

    } catch(e) {
        res.status(400).json(e);
    }

});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
