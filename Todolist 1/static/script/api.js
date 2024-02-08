const list_view = document.querySelector('#list_view');
const add_task = document.querySelector('#form');

const get_data = async() =>{
    let url = "http://127.0.0.1:8000/api/task_list";
    const response = await fetch(url);

    if (response.status !== 200){
        throw new Error('cannot fetch the data');
    }

    const data = await response.json();
    return data;
}
get_data()
.then((data)=>{
    console.log('resolved')
    for (let i = 0; i < data.length; i++) {
        let html = ''
        if (data[i].completed === true){
            html = `
            <div id="${data[i].id}" class= "flex">
                <p style="text-decoration:line-through;">
                    ${data[i].title}
                </p>
                <div>
                    <button value="delete" class = "delete_btn">delete</button> ||
                    <button value="update" class="edit_btn">update</button>
                </div>
                <div>
                    <input type="checkbox" name="completed" class="complete_task" checked>
                    <label for="completed">completed</label>
                </div>
            </div>
            `
        }else{
            html = `
            <div id="${data[i].id}" class= "flex">
                <p>
                    ${data[i].title}
                </p>
                <div>
                    <button value="delete" class = "delete_btn">delete</button> ||
                    <button value="update" class="edit_btn">update</button>
                </div>
                <div>
                    <input type="checkbox" name="completed" class="complete_task">
                    <label for="completed">completed</label>
                </div>
            </div>
            `
        }
        list_view.innerHTML += html
    }
})
.catch((err)=>{
    console.log('rejected', err)
})


list_view.addEventListener('click', event=>{
    if (event.target.classList.contains('delete_btn')){
        const task_item = event.target.closest('.flex');
        const task_id = task_item.id
        let url = `http://127.0.0.1:8000/api/task_delete/${task_id}/`;
        let csrf_token = document.querySelector('[name="csrfmiddlewaretoken"]').value;
        $.ajax({
            type: "DELETE",
            url: url,
            data: {
                'csrfmiddlewaretoken':csrf_token
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRFToken', csrf_token);
            },
            success: function (response) {
              console.log('data deleted successfully');
              task_item.remove()
            },
            error: function (xhr, errmsg, err) {
              console.log(errmsg);
            }
        });
    }
})


let current_task_id = null; // Declare the variable globally

list_view.addEventListener('click', event => {
    if(event.target.classList.contains('edit_btn')) {
        const task_item = event.target.closest('.flex');
        const task_id = task_item.id;
        const task_title = task_item.querySelector('p').textContent.trim();
        let new_task = document.querySelector('.new_task');
        new_task.value = task_title;
        
        // Set the current task id for updating
        current_task_id = task_id;
    }
});

add_task.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let url;
    let method;
    if (current_task_id) {
        // Update an existing task
        url = `http://127.0.0.1:8000/api/task_update/${current_task_id}/`;
        method = 'PUT';
    } else {
        // Create a new task
        url = 'http://127.0.0.1:8000/api/task_create';
        method = 'POST';
    }
    
    let csrf_token = add_task.querySelector('[name="csrfmiddlewaretoken"]').value;
    let new_task = document.querySelector('.new_task').value;

    $.ajax({
        type: method,
        url: url,
        data: {
            'csrfmiddlewaretoken': csrf_token,
            'title': new_task
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrf_token);
        },
        success: function (response) {
            add_task.reset();
            new_task.value = '';
            
            if (current_task_id) {
                console.log('Data updated successfully');
                // Update task title in the DOM for existing task
                const task_item = document.getElementById(current_task_id);
                task_item.querySelector('p').textContent = new_task;
                current_task_id = null; // Reset the current_task_id after updating
            } else {
                // Add new task to the DOM
                console.log('Data sent successfully');
                let html = `
                    <div id="${response.id}" class="flex">
                        <p>
                            ${new_task}
                        </p>
                        <div>
                            <button class="delete_btn">delete</button> ||
                            <button class="edit_btn">update</button>
                        </div>
                        <div>
                            <input type="checkbox" name="completed">
                            <label for="completed">completed</label>
                        </div>
                    </div>
                `;
                list_view.insertAdjacentHTML('afterbegin', html);
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(errmsg);
        }
    });
});

list_view.addEventListener('click', event=>{
    if(event.target.classList.contains('complete_task')){
        const task_item = event.target.closest('.flex');
        const task_id = task_item.id
        const p = task_item.querySelector('p')
        const checkbox = task_item.querySelector('.complete_task')

        let url = `http://127.0.0.1:8000/api/task_update/${task_id}/`
        let csrf_token = document.querySelector('[name="csrfmiddlewaretoken"]').value;
        if (checkbox.checked){
            $.ajax({
                type: "PUT",
                url: url,
                data: {
                    'completed':true
                },
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('X-CSRFToken', csrf_token);
                },
                success: function (response) {
                    console.log(`${task_id} was checked`);
                    checkbox.checked = true
                    p.style.textDecoration = "line-through";
                },
                error: function (xhr, errmsg, err) {
                  console.log(errmsg);
                }
            });
        }else{
            $.ajax({
                type: "PUT",
                url: url,
                data: {
                    'completed':false
                },
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('X-CSRFToken', csrf_token);
                },
                success: function (response) {
                    console.log(`${task_id} was unchecked`)
                    checkbox.checked = false
                    p.style.textDecoration = "none";
                },
                error: function (xhr, errmsg, err) {
                  console.log(errmsg);
                }
            });
        }
    }
})