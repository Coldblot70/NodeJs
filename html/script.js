let chatB = document.getElementById('chatButton');
let container = document.querySelector('.container');
let closeButton = document.querySelector('.close');

chatButton.addEventListener('click', (e) => {
    container.style.display = "flex";
    chatB.style.display = 'none';
});
closeButton.addEventListener('click', (e) => {
    container.style.display = "none";
    chatB.style.display = 'flex';
});