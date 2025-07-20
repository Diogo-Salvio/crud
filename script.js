const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');

const tasks = []


openBtn.addEventListener('click', () => {
    modal.classList.add("open");
})

closeBtn.addEventListener('click', () => {
    modal.classList.remove("open");
})

modal.addEventListener('click', (event) => {
    if (event.target === modal){
        modal.classList.remove("open");
    }
})


function createTask() {
    const title = document.getElementById('title');
    const date = document.getElementById('date');
    const description = document.getElementById('description');
    const newTask = {title: title.value, date: date.value, description: description.value};
    
    const containerCards = document.getElementById('pendingtasks')
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
    inputDate.value = newTask.date;
    newCard.appendChild(inputDate);

    const descriptionP = document.createElement('p');
    descriptionP.textContent = newTask.description;
    newCard.appendChild(descriptionP);

    const buttonRemove = document.createElement('button');
    buttonRemove.innerHTML = "Excluir Tarefa"
    newCard.appendChild(buttonRemove);

    const buttonEdit = document.createElement('button');
    buttonEdit.innerHTML = "Editar Tarefa"
    newCard.appendChild(buttonEdit);
    
    containerCards.appendChild(newCard)
    
    
    tasks.push(newTask);
    console.log(tasks);


}