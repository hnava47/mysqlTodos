const express = require('express');
const connection = require('./config');

const PORT = process.env.PORT || 3001;

const app = express();

// Turn on body parser
// Makes req.body exist
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// User API's
app.get('/api/users', async (req, res) => {
    try {
        const getAllUsersQuery = 'SELECT * FROM users;';
        const [users] = await connection.query(getAllUsersQuery);
        res.json(users);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/api/users', async (req, res) => {
    const {username} = req.body;

    if (!username) {
        return res.status(400).json({error: 'You must provide a username'});
    }

    try {
        const createUserQuery = 'INSERT INTO users(username) VALUES(?);';
        const getUserById = 'SELECT * FROM users WHERE id = ?;';

        const [result] = await connection.query(createUserQuery, username);
        const [userResult] = await connection.query(getUserById, result.insertId);
        res.json(userResult[0]);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get('/api/todos', async (req, res) => {
    try {
        const getAllTodosQuery = 'SELECT td.id, td.task, td.completed, td.date_created, us.username FROM todos td LEFT JOIN users us ON td.userId = us.id;';
        const [todos] = await connection.query(getAllTodosQuery);
        res.json(todos);
    } catch (e) {
        res.status(400).json(e);
    }
});

// Post - create todo
// async await
// Declaring a function as "async" allows us to use "await" syntax inside the function
app.post('/api/todos', async (req, res) => {
    const {task, userId} = req.body;

    // If the user does not provide a task, respond with an error
    if (!task) {
        return res.status(400).json({error: 'You must provide a task'});
    }

    try {
        const insertQuery = 'INSERT INTO todos(task, userId) VALUES(?,?);';
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';

        // Destructure the mysql result to only get first index only
        const [result] = await connection.query(insertQuery, [task, userId]);

        // Whenever we do an INSERT, UPDATE, or DELETE query in mysql2 or mysql npm package
        // it doesn't give us the data that was interacted with, it instead tells us information
        // about how many rows were affected and maybe the insertId or updateId of the regarding data
        // It also gives us an array with 2 elements. The 1st one is an object where we have the information we need
        // 2nd one is null or information about the fields of that row

        const [todosResult] = await connection.query(getTodoById, result.insertId);

        res.json(todosResult[0]);

    } catch (e) {
        res.status(400).json(e);
    }
});

app.patch('/api/todos/:todoId', async (req, res) => {
    const {todoId} = req.params;
    const {task, completed} = req.body;

    if (!task || !completed) {
        return res.status(400).json({error: 'You must provide the task and completed'});
    }

    try {
        const updateTodoById = 'UPDATE todos SET task = ?, completed = ? WHERE id = ?;';
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
        const isCompleted = completed.toLowerCase() === 'true' ? 1 : 0;
        await connection.query(updateTodoById, [task, isCompleted, todoId]);
        const [todos] = await connection.query(getTodoById, todoId);

        res.json(todos[0]);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete('/api/todos/:todoId', async (req, res) => {
    const {todoId} = req.params;

    try {
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
        const deleteTodoById = 'DELETE FROM todos WHERE id = ?;';
        const [todos] = await connection.query(getTodoById, todoId);

        if (!todos[0]) {
            return res.status(404).json({error: 'Todo not found'});
        }

        await connection.query(deleteTodoById, todoId);
        res.json(todos[0]);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
