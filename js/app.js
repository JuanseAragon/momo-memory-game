function validarFormulario(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    const tamano = document.getElementById('tamano').value;
    const avatarSrc = document.getElementById('avatarImg').src;
    const errorMessage = document.getElementById('error-message');

    // Validar nombre: 2-8 caracteres, solo letras y números
    const usernameRegex = /^[a-zA-Z0-9]{2,8}$/;
    if (!usernameRegex.test(username)) {
        errorMessage.textContent = 'El nombre debe tener entre 2 y 8 caracteres y no contener caracteres especiales.';
        errorMessage.style.display = 'block';
        return false;
    }

    // Validar dificultad seleccionada
    else if (!difficulty) {
        errorMessage.textContent = 'Selecciona una dificultad.';
        errorMessage.style.display = 'block';
        return false;
    }

    // Validar tamaño seleccionado
    else if (!tamano) {
        errorMessage.textContent = 'Selecciona un tamaño.';
        errorMessage.style.display = 'block';
        return false;
    }

    const jugador = {
        username,
        difficulty,
        tamano,
        avatarSrc
    };

    sessionStorage.setItem('jugador', JSON.stringify(jugador));

    // Si todo es válido, enviar el formulario
    event.target.submit();
}

//dragstart
function comenzarArrastrar(event) {
    event.dataTransfer.setData("imagenSrc", event.target.src);
}

//dragover
function permitirArrastre(event) {
    event.preventDefault();
}

//drop
function finalizarArrastre(event) {
    event.preventDefault();

    const draggedSrc = event.dataTransfer.getData("imagenSrc");
    if (!draggedSrc) return;

    const mainAvatar = document.getElementById('avatarImg');
    const oldMainSrc = mainAvatar.src;

    // 1) Poner en el avatar grande la imagen arrastrada
    mainAvatar.src = draggedSrc;

    // 2) Buscar la miniatura origen y ponerle la imagen anterior del avatar grande
    const origen = Array.from(document.querySelectorAll('.avatarImgSelect'))
                        .find(img => img.src === draggedSrc);
    if (origen) origen.src = oldMainSrc;
}

// Cargar Listeners
function cargarListeners() {
    const formulario = document.getElementById('login-form');
    const avatares = document.querySelectorAll('.avatarImgSelect');
    const avatarSeleccionado = document.getElementById('avatarImg');

    avatares.forEach(avatar => {
        avatar.addEventListener('dragstart', comenzarArrastrar);
    });

    avatarSeleccionado.addEventListener('dragover', permitirArrastre);
    avatarSeleccionado.addEventListener('drop', finalizarArrastre);

    

    formulario.addEventListener('submit', validarFormulario);
}

document.addEventListener("DOMContentLoaded", cargarListeners);