let arrow = document.querySelector("#arrow");
let ul = document.querySelector(".list");
let li = document.querySelectorAll(".list li");
let createTaskForm = document.querySelector('form[id="add-task"]');
let updateForm = document.querySelector('form[id="update-task"]');
let input = document.querySelector('input[type="text"]');
let des_input = document.querySelector('textarea[name="description"]');
let task = document.querySelectorAll(".task");
let nav = document.querySelector("body nav");
let deg = 0;
let main = '#EE7214'
let task_container = document.querySelector('#task-container');

console.log(task_container.contains(document.querySelector('.task')));
if (task_container.contains(document.querySelector('.task'))) {
    document.getElementById('no-task-img').classList.add('hidden');
}
else {
    document.getElementById('no-task-img').classList.remove('hidden');
}

let curr_id = null;
function showOrHideDropdown() {
    deg = (deg + 180) % 360;
    arrow.style.transform = `rotateZ(${deg}deg)`;
    ul.classList.toggle('active');
}

let edit_link_handler = (event) => {
    event.preventDefault();
    $("#update-task").slideToggle(300);
    $("#add-task").slideUp(300);
    curr_id = $(event.target).parent().data('id');
    console.log(curr_id);
    let mydate = new Date(document.querySelector(`#task-${curr_id} p.date`).innerText);
    console.log(mydate);
    const formattedDate = mydate.toISOString().substring(0, 10);
    console.log(formattedDate);
    $("#update-task").find("textarea[name=description]").val(document.querySelector(`#task-${curr_id} p.task-description`).innerText);
    $("#update-task").find("input[name=category]").val(document.querySelector(`#task-${curr_id} p.label`).innerText);
    $("#update-task").find("input[name=date]").val(formattedDate);
}

let create_form_toggle = () => {
    $("#add-task").slideToggle(300);
}
let update_form_toggle = () => {
    $("#update-task").slideToggle(300);
}

arrow.addEventListener('click', showOrHideDropdown);
input.addEventListener('click', () => {
    input.blur();
    showOrHideDropdown();
});

$("#arrow2").click(() => {
    $("#update-list").slideToggle(400);
})
$("#update-list li").click((event) => {
    if ($(event.target).text() == 'Other') {
        $("#update-task input[name=category]").val('');
        $("#update-task input[name=category]").attr("placeholder", "Enter other category..");
        $("#update-task input[name=category]").focus();
    }
    else {
        $("#update-task input[name=category]").val($(event.target).text());
    }
    $("#update-list").slideToggle(400);
})

for (let i = 0; i < li.length; i++) {
    li[i].addEventListener("click", () => {
        if (li[i].innerText == 'Other') {
            input.value = "";
            input.placeholder = 'Enter other category..';
            input.focus();
        }
        else {
            input.value = li[i].innerText;
        }
        showOrHideDropdown();
    })
}

$("#sidebar>button").click(() => {
    $("body nav").toggle(300);
})
$(".delete-link").click(function (event) {
    event.preventDefault();
    $.ajax({
        url: $(this).prop('href'),
        type: 'get',
        success: function (data) {
            new Noty({
                theme: 'relax',
                timeout: 2000,
                type: 'success',
                layout: 'topCenter',
                text: data.message
            }).show();
            $(`#task-${data.data.task_id}`).remove();
            console.log(data);
            if (data.data.task_count <= 0)
                document.getElementById('no-task-img').classList.remove('hidden');

            else
                document.getElementById('no-task-img').classList.add('hidden');

        },
        error: function (err) {
            new Noty({
                theme: 'relax',
                timeout: 2000,
                type: 'error',
                layout: 'topCenter',
                text: err.responseJSON.message
            }).show();
            console.log(err.responceText);
        }
    })
})

let delete_task = (delete_link) => {
    $(delete_link).click(function (event) {
        event.preventDefault();
        $.ajax({
            url: $(delete_link).prop('href'),
            type: 'get',
            success: function (data) {
                new Noty({
                    theme: 'relax',
                    timeout: 2000,
                    type: 'success',
                    layout: 'topCenter',
                    text: data.message
                }).show();
                console.log(data);
                $(`#task-${data.data.task_id}`).remove();
                console.log(data.task_count);
                if (data.data.task_count <= 0)
                    document.getElementById('no-task-img').classList.remove('hidden');
                else
                    document.getElementById('no-task-img').classList.add('hidden');
            },
            error: function (err) {
                new Noty({
                    theme: 'relax',
                    timeout: 2000,
                    type: 'error',
                    layout: 'topCenter',
                    text: err.responseJSON.message
                }).show();
                console.log(err.responceText);
            }
        })
    })
}
let create_task = () => {
    let add_form = $("#add-task");
    add_form.submit((e) => {
        e.preventDefault();
        $.ajax({
            url: "/task/create",
            type: "POST",
            data: add_form.serialize(),
            success: function (data) {
                new Noty({
                    theme: 'relax',
                    timeout: 2000,
                    type: 'success',
                    layout: 'topCenter',
                    text: data.message
                }).show();
                let new_task = newTask(data.data.task);
                $("#task-container").prepend(new_task);
                delete_task($(' .delete-link', new_task));
                $(".edit-link").parent().click(edit_link_handler);
                createTaskForm.reset();
                create_form_toggle();
                document.getElementById('no-task-img').classList.add('hidden');
            },
            error: function (err) {
                new Noty({
                    theme: 'relax',
                    timeout: 2000,
                    type: 'error',
                    layout: 'topCenter',
                    text: err.responseJSON.message
                }).show();
                console.log(err.responceText);
            }
        })
    })
}

let newTask = (task) => {
    return $(`<div id="task-${task._id}" class="task">
                        <a class="delete-link" href="/task/delete/${task._id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                        <div>
                            <div class="description">
                                <p class="task-description">
                                    ${task.description}
                                </p>
                                <span>
                                    <a class="edit-link" href="" data-id="${task._id}">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </a>
                                </span>
                            </div>
                            <div>
                                <i class="fa-solid fa-calendar-days"></i>
                                <p class="date">
                                    ${new Date(task.date)}
                                </p>
                            </div>
                        </div>
                        <p class="label">
                            ${task.category}
                        </p>
                    </div>`
    )
}

create_task();

$("#new-task-button").click(() => {
    create_form_toggle();
    $("#update-task").slideUp(300);
    setTimeout(() => {
        des_input.focus();
    }, 300)
});
$("#add-task button.cancel").click(create_form_toggle);
$("#add-task button.reset").click(() => {
    createTaskForm.reset();
});
$("#update-task button.cancel").click(update_form_toggle);
$("#update-task button.reset").click(() => {
    updateForm.reset();
});

$(".edit-link").click(edit_link_handler);


$("#update-task").submit(function (event) {
    event.preventDefault();
    let formData = new FormData(this);
    let jsonData = Object.fromEntries(formData);
    let data = $('#update-task').serialize();
    console.log(data.category);
    $.ajax({
        url: "/task/update",
        type: 'post',
        data: {
            form_data: jsonData,
            id: curr_id
        },
        success: function (data) {
            new Noty({
                theme: 'relax',
                timeout: 2000,
                type: 'success',
                layout: 'topCenter',
                text: data.message
            }).show();
            console.log(document.querySelector(`#task-${data.data.task._id} p.task-description`));
            document.querySelector(`#task-${data.data.task._id} p.task-description`).innerText = data.data.task.description;
            document.querySelector(`#task-${data.data.task._id} p.label`).innerText = data.data.task.category;
            document.querySelector(`#task-${data.data.task._id} p.date`).innerText = new Date(data.data.task.date);
            updateForm.reset();
            update_form_toggle();
        },
        error: function (err) {
            new Noty({
                theme: 'relax',
                timeout: 2000,
                type: 'error',
                layout: 'topCenter',
                text: err.responseJSON.message
            }).show();
            console.log(err.responceText);
        }
    })
})
