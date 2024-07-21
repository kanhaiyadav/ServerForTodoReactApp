// Get references to the file input and the preview element
const fileInput = document.querySelector("input[type='file']");
const preview = document.querySelector("label[for='upload'] img");
const submit_btn = document.querySelector('#update-form button[type="submit"]');
const img = document.querySelector("#profile img");
const user_name = document.getElementById('name');
const update_form = document.querySelector('#update-form');
const edit_btn = document.getElementById('edit-button');
const cancel_btn = document.getElementById('cancel');
console.log(submit_btn);


let tollgleUpdateForm = () => {
    // event.preventDefault();
    update_form.classList.toggle('expand');
}
// Add an event listener to the file input to handle file selection
fileInput.addEventListener('change', function () {
    // Check if any file is selected
    if (fileInput.files && fileInput.files[0]) {
        // Get the selected file
        const file = fileInput.files[0];

        // Check if the selected file is an image
        if (file.type.startsWith('image/')) {
            // Create a FileReader instance
            const reader = new FileReader();

            // Set up the FileReader to read the selected file as a data URL
            reader.onload = function (e) {
                preview.src = e.target.result;
            };

            // Read the selected file as a data URL
            reader.readAsDataURL(file);
        } else {
            // If the selected file is not an image, display a message
            preview.innerHTML = '<p>Selected file is not an image.</p>';
        }
    } else {
        // If no file is selected, clear the preview
        preview.innerHTML = '';
    }
});


update_form.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log(new FormData(this));
    let url = "/user/update";
    let responce = await fetch(url, {
        url: url,
        method: "POST",
        body: new FormData(this),
    });
    if (responce.ok) {
        responce = await responce.json();
        console.log(responce);
        img.src = responce.data.src;
        user_name.innerText = responce.data.name;
        tollgleUpdateForm();
    }
    else {
        console.log(error.responseText);
    }
})
edit_btn.addEventListener('click', tollgleUpdateForm);
cancel_btn.addEventListener('click', tollgleUpdateForm);
