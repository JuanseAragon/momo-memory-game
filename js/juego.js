

function comprobarDatosJugador() {
    if (!sessionStorage.getItem('jugador')) {
        window.location.href = 'index.html';
    }
    }

var cartasVolteadas = [];
var cartasAcertadas = [];
var totalCartasGlobal = 0;

//crea el
function crearTablero(tamano, dificultad) {
    const tablero = document.getElementById('pantallaDeJuego');
    tablero.innerHTML = ""; // Limpia el tablero
    const totalCartas = tamano * tamano;

    // Lista base de imágenes (sin plus ni bomba)
    let imagenesBase = [
    "img/avatar-1.jpg",
    "img/avatar-2.jpg",
    "img/avatar-3.jpg",
    "img/avatar-4.jpg",
    "img/carta-1.jpg",
    "img/carta-2.jpg",
    "img/carta-3.jpg",
    "img/carta-4.jpg",
    "img/carta-5.jpg",
    "img/carta-6.jpg",
    "img/logo.jpg"
    ];

    //Cartas especiales
    let cartasEspeciales = [];

    // Agrega cartas especiales según dificultad
    if (dificultad === "3") { // Fácil
        cartasEspeciales.push('img/plus.jpg');
    } else if (dificultad === "2") { // Media
        cartasEspeciales.push('img/plus.jpg', 'img/bomba.jpg');
    } else if (dificultad === "1") { // Difícil
        cartasEspeciales.push('img/plus.jpg', 'img/bomba.jpg', 'img/bomba.jpg');
    }

    // Calcula cuántos pares normales necesitas
    let cantidadEspeciales = cartasEspeciales.length;
    let cantidadParesNormales = (totalCartas - cantidadEspeciales) / 2;
    totalCartasGlobal = cantidadParesNormales * 2; // Total de cartas incluyendo especiales

    // Selecciona imágenes normales y duplica cada una
    let imagenesSeleccionadas = imagenesBase.slice(0, cantidadParesNormales);
    let cartas = [];

    imagenesSeleccionadas.forEach(src => {
        cartas.push(src, src); // dos de cada una
    });

    // Agrega cartas especiales (solo una de cada, excepto bomba difícil que son dos)
    cartasEspeciales.forEach(src => {
        cartas.push(src);
    });

    // Mezcla las cartas
    cartas = shuffle(cartas);


    // Define el grid según el tamaño
    tablero.style.gridTemplateColumns = `repeat(${tamano}, 1fr)`;

    cartas.forEach((src, i) => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.dataset.src = src;
        carta.dataset.index = i;

        // Imagen dorso (siempre visible)
        const imgBack = document.createElement('img');
        imgBack.src = 'img/back.png';
        imgBack.alt = 'Dorso';
        imgBack.className = 'carta-back';

        // Imagen frente (oculta al inicio)
        const imgFront = document.createElement('img');
        imgFront.src = src;
        imgFront.alt = 'Carta';
        imgFront.className = 'carta-front';
        imgFront.style.display = 'none';

        carta.appendChild(imgBack);
        carta.appendChild(imgFront);

        // Al hacer click, voltea la carta
        carta.addEventListener('click', voltearCarta); 

        tablero.appendChild(carta);
    });
    
}

// Voltea la carta al hacer click
function voltearCarta(event) {
    const carta = event.currentTarget;
    const imgBack = carta.querySelector('.carta-back');
    const imgFront = carta.querySelector('.carta-front');
    imgBack.style.display = 'none';
    imgFront.style.display = 'block';
    carta.removeEventListener('click', voltearCarta); // Desactiva el evento click para evitar doble click
    cartasVolteadas.push(carta);

    if (cartasVolteadas.length === 2) {
       setTimeout(comprobarPareja, 1000); // Espera 1 segundo antes de comprobar la pareja
        };
    }

// Comprueba si las dos cartas volteadas son iguales
function comprobarPareja() {
    //Restar cantidad de intentos
    let intentos = document.getElementById('intentos');
    intentos.textContent = parseInt(intentos.textContent) - 1;


    if (cartasVolteadas[0].dataset.src == cartasVolteadas[1].dataset.src) {
        // Si son iguales, las deja visibles
        cartasAcertadas.push(cartasVolteadas[0], cartasVolteadas[1]);
        let puntos = document.getElementById('puntos');
        puntos.textContent = parseInt(puntos.textContent) + 1; // Incrementa los puntos
    } else {
        // Si no son iguales, las vuelve a voltear
        cartasVolteadas.forEach(carta => {
            carta.addEventListener('click', voltearCarta); // Reactiva el evento click
            const imgBack = carta.querySelector('.carta-back');
            const imgFront = carta.querySelector('.carta-front');
            imgBack.style.display = 'block';
            imgFront.style.display = 'none';
        });
    }
    // Limpia el array de cartas volteadas
    cartasVolteadas = [];
    //Si acertadas es igual al total de cartas, muestra victoria
        if(cartasAcertadas.length == totalCartasGlobal) {
            mostrarVictoria(); // Llama a la función de victoria si todas las cartas han sido acertadas
        } else if (intentos.textContent <= 0) {
            mostrarDerrota(); // Llama a la función de derrota si se acabaron los intentos
        }
}


// Función para mezclar un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//Pantalla de derrota
function mostrarDerrota() {
     const tablero = document.getElementById('pantallaDeJuego');
     tablero.style.gridTemplateColumns = ''; // Quita el grid
    tablero.innerHTML = `
        <div class="resultado">
            <h2 style="color:#ff4d4f;">¡Derrota!</h2>
            <p>Te has quedado sin intentos.</p>
            <button id="btnReintentar">Volver a jugar</button>
        </div>
    `;
    document.getElementById('btnReintentar').onclick = () => location.reload();
}


//Pantalla de victoria
function mostrarVictoria() {
    const tablero = document.getElementById('pantallaDeJuego');
    tablero.style.gridTemplateColumns = ''; // Quita el grid
    tablero.innerHTML = `
        <div class="resultado">
            <h2 style="color:#c8ff00;">¡Victoria!</h2>
            <p>¡Has encontrado todas las parejas!</p>
            <button id="btnReintentar">Jugar de nuevo</button>
        </div>
    `;
    document.getElementById('btnReintentar').onclick = () => location.reload();
}

//Cargar cargar Listeners
function cargarListenersydatosJugador(){
    //Cargamos datos del jugador y configuramos el juego
    const jugador = JSON.parse(sessionStorage.getItem('jugador'));
    document.getElementById('username').textContent = jugador.username;
    document.getElementById('difficulty').textContent = jugador.difficulty;
    document.getElementById('tamano').textContent = jugador.tamano + "x" + jugador.tamano;
    document.getElementById('avatar').src = jugador.avatarSrc;
    document.getElementById('puntos').textContent = 0;
    document.getElementById('intentos').textContent = 2; //parseInt(jugador.difficulty) * 12

    // Pasa la dificultad como string
    crearTablero(parseInt(jugador.tamano), jugador.difficulty);
}

comprobarDatosJugador();
document.addEventListener('DOMContentLoaded', cargarListenersydatosJugador);


