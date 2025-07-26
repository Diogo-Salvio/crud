//Delete Button
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');

//Edit Button
const openBtnEdit = document.getElementById('openModalEdit');
const closeBtnEdit = document.getElementById('closeModal2');
const modalEdit = document.getElementById('modal2');

const tasks = []


openBtn.addEventListener('click', () => {
    modal.classList.add("open");
})

closeBtn.addEventListener('click', () => {
    modal.classList.remove("open");
})

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove("open");
    }
})

const title = document.getElementById('title');
const date = document.getElementById('date');
const description = document.getElementById('description');
const containerCards = document.getElementById('pendingtasks')
const containerFinishCards = document.getElementById('finishtasks')

function createTask() {

    const newTask = { title: title.value, date: date.value, description: description.value, id: tasks.length + 1 };

    if (date.value.length != 10) {
        window.alert('Insira uma data válida!');
    } else if (!description.value.trim()) {
        window.alert('Adicione uma descrição!');
    } else if (!title.value.trim()) {
        window.alert('Adicione um titulo!');
    } else {
        const newCard = document.createElement('div');
        newCard.classList.add('card');

        const heading = document.createElement('h3');
        heading.textContent = newTask.title;
        newCard.appendChild(heading);

        const spanDate = document.createElement('span');
        spanDate.textContent = 'Data da tarefa:';
        newCard.appendChild(spanDate);

        const inputDate = document.createElement('input');
        inputDate.type = 'date';
        inputDate.readOnly = true;
        inputDate.value = newTask.date;
        newCard.appendChild(inputDate);

        const descriptionP = document.createElement('p');
        descriptionP.textContent = newTask.description;
        newCard.appendChild(descriptionP);

        const buttonRemove = document.createElement('button');
        buttonRemove.innerHTML = "Excluir Tarefa";
        newCard.appendChild(buttonRemove);

        const buttonEdit = document.createElement('button');
        buttonEdit.innerHTML = "Editar Tarefa";
        newCard.appendChild(buttonEdit);
        buttonEdit.id = "openModalEdit";

        const checkBoxLabel = document.createElement('label');
        checkBoxLabel.innerHTML = "Concluir tarefa:";
        const inputTypeCheckBox = document.createElement('input');
        inputTypeCheckBox.type = "checkbox";
        checkBoxLabel.appendChild(inputTypeCheckBox);
        newCard.appendChild(checkBoxLabel);


        containerCards.appendChild(newCard);

        title.value = '';
        date.value = '';
        description.value = '';


        tasks.push(newTask);
        const cardId = tasks.length;
        newCard.id = `card${cardId}`;
        heading.id = `title${cardId}`;
        inputDate.id = `date${cardId}`;
        descriptionP.id = `description${cardId}`;
        inputTypeCheckBox.id = `checkTask${cardId}`;

        buttonRemove.addEventListener('click', () => {
            removeTask(cardId);
        });

        buttonEdit.addEventListener('click', () => {
            modalEdit.classList.add("open");
        })

        modalEdit.addEventListener('click', (event) => {
            if (event.target === modalEdit) {
                modalEdit.classList.remove("open");
            }
        })

        buttonEdit.addEventListener('click', () => {
            editTask(cardId);
        });

        inputTypeCheckBox.addEventListener('change', () => {
            if (inputTypeCheckBox.checked) {
                finishTask(cardId);
            } else {
                moveToPendingTasks(cardId);
            }
        })


    }




}


function removeTask(cardId) {
    const cardRemove = document.getElementById(`card${cardId}`);
    cardRemove.remove();
    tasks.splice(cardId - 1, 1)

}

let currentEditCardId = null;

const editInputTitle = document.getElementById('inputedittitle');
const editInputDate = document.getElementById('inputeditdate');
const editInputDescription = document.getElementById('inputeditdescription');

function editTask(cardId) {
    const cardEdit = document.getElementById(`card${cardId}`);
    const titleEdit = document.getElementById(`title${cardId}`);
    const dateEdit = document.getElementById(`date${cardId}`);
    const descriptionEdit = document.getElementById(`description${cardId}`);

    editInputTitle.value = titleEdit.textContent;
    editInputDate.value = dateEdit.value;
    editInputDescription.value = descriptionEdit.textContent;

    currentEditCardId = cardId;

    console.log(cardId)

}

const confirmEditButton = document.getElementById('closeModal2');
confirmEditButton.addEventListener("click", () => {
    confirmEditTask(currentEditCardId);
})

function confirmEditTask(cardId) {
    const cardEdit = document.getElementById(`card${cardId}`);
    const titleEdit = document.getElementById(`title${cardId}`);
    const dateEdit = document.getElementById(`date${cardId}`);
    const descriptionEdit = document.getElementById(`description${cardId}`);

    titleEdit.textContent = editInputTitle.value;
    dateEdit.textContent = editInputDate.value;
    descriptionEdit.textContent = editInputDescription.value;

    modalEdit.classList.remove("open");

    console.log(cardId);
};




function finishTask(cardId) {
    const cardToMove = document.getElementById(`card${cardId}`);
    containerFinishCards.appendChild(cardToMove);


};

function moveToPendingTasks(cardId) {
    const cardToMove = document.getElementById(`card${cardId}`)
    containerCards.appendChild(cardToMove);

}