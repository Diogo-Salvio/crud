//Botões do Modal para criação de tarefa
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');

//Botões do modal para edição de tarefa
const openBtnEdit = document.getElementById('openModalEdit');
const closeBtnEdit = document.getElementById('closeModal2');
const modalEdit = document.getElementById('modal2');

//Arrays referente às tasks pendentes e as finalizadas
const tasks = [];
const finishTasks = [];


//Eventos de configuração do Modal para criarção de Tarefas
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


//Inputs do Modal para criação de tarefa
const title = document.getElementById('title');
const date = document.getElementById('date');
const description = document.getElementById('description');

//Containers para as tasks pendentes e para as finalizadas
const containerCards = document.getElementById('pendingtasks')
const containerFinishCards = document.getElementById('finishtasks')

//Função que cria a task 
//Adiciona o objeto newTask no Array tasks[] e em seguida chama a função renderCard()
function createTask() {


    //Variáveis importante para a validação da Data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskdate = new Date(date.value);
    taskdate.setHours(0, 0, 0, 0);

    const newTask = {
        title: title.value,
        date: date.value,
        description: description.value,
        id: tasks.length + 1,
        datevalue: taskdate.getTime()
    };
    if (date.value.length != 10 || today.getTime() > taskdate.getTime()) {
        window.alert('Insira uma data válida!');
        date.value = '';
    } else if (!description.value.trim()) {
        window.alert('Adicione uma descrição!');
    } else if (!title.value.trim()) {
        window.alert('Adicione um titulo!');
    } else {
        tasks.push(newTask);
        containerCards.innerHTML = '';
        title.value = '';
        date.value = '';
        description.value = '';
        renderCard();
    }
}

//Função para organizar os cards e redenderizar eles no container
function renderCard() {
    containerCards.innerHTML = ""

    tasks.sort((a, b) => {
        return a.datevalue - b.datevalue;
    })
    //Renderização/criação de todos os card do array tasks[] 
    for (const task of tasks) {
        const newCard = document.createElement('div');
        newCard.classList.add('card');

        const heading = document.createElement('h3');
        heading.textContent = task.title;
        newCard.appendChild(heading);

        const spanDate = document.createElement('span');
        spanDate.textContent = 'Data da tarefa:';
        newCard.appendChild(spanDate);

        const inputDate = document.createElement('input');
        inputDate.type = 'date';
        inputDate.readOnly = true;
        inputDate.value = task.date;
        newCard.appendChild(inputDate);

        const descriptionP = document.createElement('p');
        descriptionP.textContent = task.description;
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

        //Atribuição de um ID único para todos os dados que podem ser alterados na função editCard() e nas função para finalizar a tarefa
        newCard.id = `card${task.id}`;
        heading.id = `title${task.id}`;
        inputDate.id = `date${task.id}`;
        descriptionP.id = `description${task.id}`;
        inputTypeCheckBox.id = `checkTask${task.id}`;

        //Adição dos Listeners para os botões criados
        buttonRemove.addEventListener('click', () => {
            removeTask(task.id);
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
            editTask(task.id);
        });

        inputTypeCheckBox.addEventListener('change', () => {
            if (inputTypeCheckBox.checked) {
                finishTask(task.id);
            } else {
                moveToPendingTasks(task.id);
            }
        });

        containerCards.appendChild(newCard);
    }
}

//Função que apaga o card
function removeTask(cardId) {
    const cardRemove = document.getElementById(`card${cardId}`);
    cardRemove.remove();
    tasks.splice(cardId - 1, 1)
    renderCard();

}

//Variável que guarda qual Card está sendo editado
let currentEditCardId = null;

//Inputs do modal de edição
const editInputTitle = document.getElementById('inputedittitle');
const editInputDate = document.getElementById('inputeditdate');
const editInputDescription = document.getElementById('inputeditdescription');

//Função que adiciona os dados do card que foi escolido para ser editado no modal de edição.
function editTask(cardId) {
    const titleEdit = document.getElementById(`title${cardId}`);
    const dateEdit = document.getElementById(`date${cardId}`);
    const descriptionEdit = document.getElementById(`description${cardId}`);

    editInputTitle.value = titleEdit.textContent;
    editInputDate.value = dateEdit.value;
    editInputDescription.value = descriptionEdit.textContent;

    currentEditCardId = cardId;
}

//Adição no evento click no botão ne finalizar a edição
const confirmEditButton = document.getElementById('closeModal2');
confirmEditButton.addEventListener("click", () => {
    confirmEditTask(currentEditCardId);
})

//Função que adiciona os valores novos ao Card
function confirmEditTask(cardId) {
    const titleEdit = document.getElementById(`title${cardId}`);
    const dateEdit = document.getElementById(`date${cardId}`);
    const descriptionEdit = document.getElementById(`description${cardId}`);

    titleEdit.textContent = editInputTitle.value;
    dateEdit.textContent = editInputDate.value;
    descriptionEdit.textContent = editInputDescription.value;

    modalEdit.classList.remove("open");

    renderCard();

};

//Função que move a tarefa para as o grupo de tarefas prontas. Remove do array tasks e adiciona no array finishtasks
function finishTask(cardId) {
    const cardToMove = document.getElementById(`card${cardId}`);
    containerFinishCards.appendChild(cardToMove);

    const indextomove = tasks.findIndex(task => task.id === cardId);
    finishTasks.push(tasks[indextomove]);
    tasks.splice(indextomove, 1);
    console.log(finishTasks);
    console.log(tasks);

};

//Função que move a tarefa para as o grupo de tarefas pendentes. Remove do array finishtasks e adiciona no array tasks
function moveToPendingTasks(cardId) {
    const cardToMove = document.getElementById(`card${cardId}`)
    containerCards.appendChild(cardToMove);

    const indextomove = finishTasks.findIndex(task => task.id === cardId);
    tasks.push(finishTasks[indextomove]);
    finishTasks.splice(indextomove, 1);
    console.log(finishTasks);
    console.log(tasks);

    //renderCard();

}