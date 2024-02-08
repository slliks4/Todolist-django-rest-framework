function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken')

Build_list()
function Build_list(){
    var list_view = document.getElementById('list_view');
    list_view.innerHTML = ''
    var url = 'http://127.0.0.1:8000/api/task_list';
    fetch (url)
    .then((Response) => Response.json ())
    .then(function(data){
        console.log(data)
        var task_list = data;
        for (i in task_list){
            list = `
            <div id="data-row-${i}" class= "flex">
                <p>
                    ${task_list[i].title}
                </p>
                <div>
                    <button value="delete">delete</button> ||
                    <button value="update" id="edit">update</button>
                </div>
                <div>
                    <input type="checkbox" name="completed" id="">
                    <label for="completed">completed</label>
                </div>
            </div>
            `
            list_view.innerHTML += list
        }
    })
}

var form = document.getElementById('form')
form.addEventListener('submit', function(e){
    e.preventDefault()
    console.log('form submited')
    var url = 'http://127.0.0.1:8000/api/task_create';
    var title = document.getElementById('title').value
    fetch(url, {
        method : 'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'title':title})
    }).then(function(Response){
        Build_list()
        document.getElementById('form').reset()
    })
})

function Update_task() {
    console.log('update item')
}

