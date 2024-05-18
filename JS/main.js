const API = " http://localhost:8001/book";
const nameInput = document.querySelector("#name");
const lastNameInput = document.querySelector("#lastName");
const phoneNumberInput = document.querySelector("#phoneNumber");
const photoInput = document.querySelector("#photo");
const addButton = document.querySelector(".btn-add");
let contactList = document.querySelector(".contact-list");

// CREATE
addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const phoneNumber = phoneNumberInput.value.trim();
  const photo = photoInput.value.trim();

  if (!name || !lastName || !phoneNumber || !photo) {
    alert("Please fill in all fields");
    return;
  }

  const newContact = {
    name: name,
    lastName: lastName,
    phoneNumber: phoneNumber,
    photo: photo,
  };

  createContact(newContact);
  readContacts();
  nameInput.value = "";
  lastNameInput.value = "";
  phoneNumberInput.value = "";
  photoInput.value = "";
});

function createContact(contact) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContacts());
}

// READ
function readContacts() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      contactList.innerHTML = "";
      data.forEach((contact) => {
        contactList.innerHTML += `
          <div>
            <p class ="contacts">Name: ${contact.name}  </p>
            <p class ="contacts">Last Name: ${contact.lastName} </p>
            <p class ="contacts">Phone Number: ${contact.phoneNumber} </p>
            <img src="${contact.photo}" alt="Contact Photo" class = "photo">
            <button id="${contact.id}" class="btn-delete">Delete</button>
            <button id="${contact.id}" class="btn-edit">Edit</button>
            <hr class ="hr">
          </div>
        `;
      });
    });
}
readContacts();

// DELETE
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then(() => readContacts());
    // deleteContact(id);
  }
});

// function deleteContact(id) {
//   fetch(`${API}/${id}`, {
//     method: "DELETE",
//   }).then(() => readContacts());
// }

// EDIT
const editNameInput = document.querySelector("#editName");
const editLastNameInput = document.querySelector("#editLastName");
const editPhoneNumberInput = document.querySelector("#editPhoneNumber");
const editPhotoInput = document.querySelector("#editPhoto");
const editButton = document.querySelector(".btn-edit-save");
const editModal = document.querySelector(".edit-modal");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.id;
    editModal.style.display = "block";
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((contact) => {
        editNameInput.value = contact.name;
        editLastNameInput.value = contact.lastName;
        editPhoneNumberInput.value = contact.phoneNumber;
        editPhotoInput.value = contact.photo;
        editButton.setAttribute("data-id", contact.id);
      });
  }
});

editButton.addEventListener("click", () => {
  const id = editButton.getAttribute("data-id");
  const editedContact = {
    name: editNameInput.value.trim(),
    lastName: editLastNameInput.value.trim(),
    phoneNumber: editPhoneNumberInput.value.trim(),
    photo: editPhotoInput.value.trim(),
  };
  if (
    !editedContact.name ||
    !editedContact.lastName ||
    !editedContact.phoneNumber ||
    !editedContact.photo
  ) {
    alert("Please fill in all fields");
    return;
  }

  editContact(id, editedContact);
  editModal.style.display = "none";
});

function editContact(id, contact) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContacts());
}
