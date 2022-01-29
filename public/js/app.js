$(document).ready(async function() {
    const $todos = $('.todos');
    const $addTodoBtn = $('#addTodo');
    const $taskInput = $('#task');
    const $userIdInput = $('#userId');

    $addTodoBtn.on('click', async function(event) {
        event.preventDefault();
        const newTodo = {
            task: $taskInput.val(),
            userId: $userIdInput.val()
        };

        try {
            const createdTodo = await $.post('/api/todos', newTodo);
            const $ul = $('<ul>').addClass('list-group list-group-horizontal');
            const $taskLi = $('<li>').text(createdTodo.task).addClass('list-group-item');
            const $usernameLi = $('<li>').text(createdTodo.username).addClass('list-group-item');
            const $btnLi = $('<li>').addClass('list-group-item');
            const $deleteBtn = $('<button>').text('Delete').addClass('deleteBtn').attr('id', todo.id);

            if (createdTodo.completed) {
                $taskLi.addClass('list-group-item-success');
                $usernameLi.addClass('list-group-item-success');
                $btnLi.addClass('list-group-item-success');
            } else {
                $taskLi.addClass('list-group-item-danger');
                $usernameLi.addClass('list-group-item-danger');
                $btnLi.addClass('list-group-item-danger');
            }

            $btnLi.append($deleteBtn);
            $ul.append($taskLi, $usernameLi, $btnLi);
            $todos.append($ul);
        } catch (e) {
            alert(e);
        }
    })

    const fetchTodos = async() => {
        try {
            const todos = await $.get('/api/todos');
            todos.forEach(todo => {
                const $ul = $('<ul>').addClass('list-group list-group-horizontal');
                const $taskLi = $('<li>').text(todo.task).addClass('list-group-item');
                const $usernameLi = $('<li>').text(todo.username).addClass('list-group-item');
                const $btnLi = $('<li>').addClass('list-group-item');
                const $deleteBtn = $('<button>').text('Delete').addClass('deleteBtn').attr('id', todo.id);

                if (todo.completed) {
                    $taskLi.addClass('list-group-item-success');
                    $usernameLi.addClass('list-group-item-success');
                    $btnLi.addClass('list-group-item-success');
                } else {
                    $taskLi.addClass('list-group-item-danger');
                    $usernameLi.addClass('list-group-item-danger');
                    $btnLi.addClass('list-group-item-danger');
                }

                $btnLi.append($deleteBtn);
                $ul.append($taskLi, $usernameLi, $btnLi);
                $todos.append($ul);
            });
        } catch (e) {
            alert(e);
        }
    };

    $(document).on('click', '.deleteBtn', async function(){
        const todoId = $(this).attr('id');
        try {
            await $.ajax({
                method: 'DELETE',
                url: `/api/todos/${todoId}`
            });

            $todos.empty();
            await fetchTodos();
        } catch (e) {
            alert(e);
        }
    })

    await fetchTodos();

});
