//Botões do Modal para criação de tarefa
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');

//Botões do modal para edição de tarefa
const openBtnEdit = document.getElementById('openModalEdit');
const closeBtnEdit = document.getElementById('closeModal2');
const modalEdit = document.getElementById('modal2');

//Arrays referente às tasks pendentes e as finalizadas
let tasks = [];
let finishTasks = [];

window.onload = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    finishTasks = JSON.parse(localStorage.getItem('finishTasks')) || [];
    renderCard();
    renderFinishCard();
};

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

    const randomId = getRandomInt(1 ,100);

    const newTask = {
        title: title.value,
        date: date.value,
        description: description.value,
        id: randomId,
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
        saveInLocalStorage();
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

        const copyButton = document.createElement('button');
        copyButton.innerHTML = "Copiar tarefa";
        newCard.appendChild(copyButton);

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

        const inputTypeFile = document.createElement('input');
        inputTypeFile.type = "file";
        inputTypeFile.accept = "iamge/jpeg, image/png , image/jpg";
        newCard.appendChild(inputTypeFile);

        const buttonOpenModalImg = document.createElement('button');
        buttonOpenModalImg.innerHTML = "Visualizar imagem anexada";
        if (!task.imgurl){
        buttonOpenModalImg.style.display = "none";
        };
        newCard.appendChild(buttonOpenModalImg);


        //Atribuição de um ID único para todos os dados que podem ser alterados na função editCard() e nas função para finalizar a tarefa
        newCard.id = `card${task.id}`;
        heading.id = `title${task.id}`;
        inputDate.id = `date${task.id}`;
        descriptionP.id = `description${task.id}`;
        inputTypeCheckBox.id = `checkTask${task.id}`;
        inputTypeFile.id = `inputfile${task.id}`;
        buttonOpenModalImg.id = `buttonopenimg${task.id}`;

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

        copyButton.addEventListener('click', () => {
            copyDescription(task.id);
        });

        inputTypeFile.addEventListener('change', () => {
            readImage(task.id);
        });

        buttonOpenModalImg.addEventListener('click', () => {
            openModalImg(task.id);
        });

        containerCards.appendChild(newCard);
    }
}

//Função que apaga o card
function removeTask(cardId) {
    const cardRemove = document.getElementById(`card${cardId}`);
    cardRemove.remove();

    const indexInTasks = tasks.findIndex(task => task.id === cardId);
    if (indexInTasks !== -1) {
        tasks.splice(indexInTasks, 1);
        renderCard();
        saveInLocalStorage();
    };

    const indexInFinishTasks = finishTasks.findIndex(task => task.id === cardId);
    if (indexInFinishTasks !== -1) {
        finishTasks.splice(indexInFinishTasks, 1);
        renderFinishCard();
        saveInLocalStorage();
    };
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

    //Variáveis importante para a validação da Data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskdate = new Date(editInputDate.value);
    taskdate.setHours(0, 0, 0, 0);

    //Validação para os dados inseridos no modal de edição
    if (editInputDate.value.length != 10 || today.getTime() > taskdate.getTime()) {
        window.alert('Insira uma data válida!');
        date.value = '';
    } else if (!editInputDescription.value.trim()) {
        window.alert('A tarefa precisar ter uma descrição!');
    } else if (!editInputTitle.value.trim()) {
        window.alert('A tarefa precisar ter um título!');
    } else {
        //Ao passar por todas as validações o código atualiza os dados do card e também atualiza os valores das chaves que foram editadas no array tasks
        titleEdit.textContent = editInputTitle.value;
        dateEdit.textContent = editInputDate.value;
        descriptionEdit.textContent = editInputDescription.value;

        const valueOfTheNewEditedTitle = titleEdit.textContent;
        const valueOfTheNewEditedDate = dateEdit.textContent;
        const valueOfTheNewEditedDescription = descriptionEdit.textContent;

        const indexToEditInPending = tasks.findIndex(task => task.id === cardId);
        const indexToEditInFinish = finishTasks.findIndex(task => task.id === cardId);

        if (indexToEditInPending !== -1) {
            tasks[indexToEditInPending].title = valueOfTheNewEditedTitle;
            tasks[indexToEditInPending].date = valueOfTheNewEditedDate;
            tasks[indexToEditInPending].description = valueOfTheNewEditedDescription;
            tasks[indexToEditInPending].datevalue = taskdate.getTime();

            modalEdit.classList.remove("open");
            renderCard();
            saveInLocalStorage();
        } else if (indexToEditInFinish !== -1) {
            finishTasks[indexToEditInFinish].title = valueOfTheNewEditedTitle;
            finishTasks[indexToEditInFinish].date = valueOfTheNewEditedDate;
            finishTasks[indexToEditInFinish].description = valueOfTheNewEditedDescription;
            finishTasks[indexToEditInFinish].datevalue = taskdate.getTime();

            modalEdit.classList.remove("open");
            renderFinishCard();
            saveInLocalStorage();
        }




    }

};

//Função que move a tarefa para as o grupo de tarefas prontas. Remove do array tasks e adiciona no array finishtasks
function finishTask(cardId) {
    const cardToMove = document.getElementById(`card${cardId}`);
    containerFinishCards.appendChild(cardToMove);

    const indextomove = tasks.findIndex(task => task.id === cardId);
    if (indextomove !== -1) {
        finishTasks.push(tasks[indextomove]);
        tasks.splice(indextomove, 1);
        renderFinishCard();
        saveInLocalStorage();
    };

};

//Função que move a tarefa para as o grupo de tarefas pendentes. Remove do array finishtasks e adiciona no array tasks
function moveToPendingTasks(cardId) {
    const cardToMove = document.getElementById(`card${cardId}`)
    containerCards.appendChild(cardToMove);

    const indextomove = finishTasks.findIndex(task => task.id === cardId);
    if (indextomove !== -1) {
        tasks.push(finishTasks[indextomove]);
        finishTasks.splice(indextomove, 1);
        renderCard();
        saveInLocalStorage();
    };

};

function renderFinishCard() {
    containerFinishCards.innerHTML = "";

    finishTasks.sort((a, b) => {
        return a.datevalue - b.datevalue;
    })
    //Renderização/criação de todos os card do array finishtasks[] 
    for (const finishtask of finishTasks) {
        const newCard = document.createElement('div');
        newCard.classList.add('card');

        const heading = document.createElement('h3');
        heading.textContent = finishtask.title;
        newCard.appendChild(heading);

        const spanDate = document.createElement('span');
        spanDate.textContent = 'Data da tarefa:';
        newCard.appendChild(spanDate);

        const inputDate = document.createElement('input');
        inputDate.type = 'date';
        inputDate.readOnly = true;
        inputDate.value = finishtask.date;
        newCard.appendChild(inputDate);

        const descriptionP = document.createElement('p');
        descriptionP.textContent = finishtask.description;
        newCard.appendChild(descriptionP);

        const copyButton = document.createElement('button');
        copyButton.innerHTML = "Copiar tarefa";
        newCard.appendChild(copyButton);

        const buttonRemove = document.createElement('button');
        buttonRemove.innerHTML = "Excluir Tarefa";
        newCard.appendChild(buttonRemove);

        const buttonEdit = document.createElement('button');
        buttonEdit.innerHTML = "Editar Tarefa";
        newCard.appendChild(buttonEdit);
        buttonEdit.id = "openModalEdit";

        const checkBoxLabel = document.createElement('label');
        checkBoxLabel.innerHTML = "Tarefa Concluida ";
        const inputTypeCheckBox = document.createElement('input');
        inputTypeCheckBox.type = "checkbox";
        inputTypeCheckBox.checked = true;
        checkBoxLabel.appendChild(inputTypeCheckBox);
        newCard.appendChild(checkBoxLabel);

        const inputTypeFile = document.createElement('input');
        inputTypeFile.type = "file";
        inputTypeFile.accept = "iamge/jpeg, image/png , image/jpg";
        newCard.appendChild(inputTypeFile);

        const buttonOpenModalImg = document.createElement('button');
        buttonOpenModalImg.innerHTML = "Visualizar imagem anexada";
        if (!finishtask.imgurl){
        buttonOpenModalImg.style.display = "none";
        };
        newCard.appendChild(buttonOpenModalImg);

        //Atribuição de um ID único para todos os dados que podem ser alterados na função editCard() e nas função para finalizar a tarefa
        newCard.id = `card${finishtask.id}`;
        heading.id = `title${finishtask.id}`;
        inputDate.id = `date${finishtask.id}`;
        descriptionP.id = `description${finishtask.id}`;
        inputTypeCheckBox.id = `checkTask${finishtask.id}`;
        inputTypeFile.id = `inputfile${finishtask.id}`;
        buttonOpenModalImg.id = `buttonopenimg${finishtask.id}`;

        //Adição dos Listeners para os botões criados
        buttonRemove.addEventListener('click', () => {
            removeTask(finishtask.id);
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
            editTask(finishtask.id);
        });

        inputTypeCheckBox.addEventListener('change', () => {
            if (inputTypeCheckBox.checked) {
                finishTask(finishtask.id);
            } else {
                moveToPendingTasks(finishtask.id);
            }
        });

        copyButton.addEventListener('click', () => {
            copyDescription(finishtask.id);
        });

        inputTypeFile.addEventListener('change', () => {
            readImage(finishtask.id);
        });

        buttonOpenModalImg.addEventListener('click', () => {
            openModalImg(finishtask.id);
        });


        containerFinishCards.appendChild(newCard);
    }
};


function copyDescription(cardId) {
    const textToBeCopy = document.getElementById(`description${cardId}`);
    navigator.clipboard.writeText(textToBeCopy.textContent)
        .then(() => {
            console.log('Texto copiado!');
        })
        .catch(() => {
            console.log("Elemento não é uma string");
        })
};


//Função para a leitura de imagem
function readImage(cardId) {
    const inpuToRead = document.getElementById(`inputfile${cardId}`);
    const buttonShowImg = document.getElementById(`buttonopenimg${cardId}`);
    const image = inpuToRead.files[0];

    if (image) {
        const reader = new FileReader();//Cria um objeto da classe FileReader(permite a leitura de arquivos do usuário)

        reader.onload = function (event) { //Quando o FileReader finaliza de ler a imagem ele dispara um evento onload 
            const imageBase64 = event.target.result; //Resultado em base64 da imagem que pode ser utilizado no URL da imagem

            const indexToAddImgInPending = tasks.findIndex(task => task.id === cardId);
            const indexToAddImgInFinish = finishTasks.findIndex(task => task.id === cardId);

            if (indexToAddImgInPending !== -1) {
                const object = tasks.find(key => key.id === cardId);
                object.imgurl = imageBase64;
            } else if (indexToAddImgInFinish !== -1) {
                const object = finishTasks.find(key => key.id === cardId);
                object.imgurl = imageBase64;
            };


        };
        reader.readAsDataURL(image);//Passa o valor para o FileReader ler
        buttonShowImg.style.display = 'block';//Mostra o botão de visualizar a imagem
        saveInLocalStorage()
    };
};


function openModalImg(cardId) {
    const modalToOpen = document.getElementById(`buttonopenimg${cardId}`);
    const modal = document.getElementById('modalimg');
    const imgInHtml = document.getElementById('img');
    modalToOpen.addEventListener('click', () => {
        modalimg.classList.add("open");
    });
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove("open");
        }
    });
    //const object = tasks.find(key => key.id === cardId);

    const indexToAddUrlInPending = tasks.findIndex(task => task.id === cardId);
    const indexToAddUrlInFinish = finishTasks.findIndex(task => task.id === cardId);

    if (indexToAddUrlInPending !== -1) {
        const object = tasks.find(key => key.id === cardId);
        imgInHtml.src = object.imgurl;
    } else if (indexToAddUrlInFinish !== -1) {
        const object = finishTasks.find(key => key.id === cardId);
        imgInHtml.src = object.imgurl;
    };

};

function saveInLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks)) || [];
    localStorage.setItem('finishTasks', JSON.stringify(finishTasks)) || [];
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
