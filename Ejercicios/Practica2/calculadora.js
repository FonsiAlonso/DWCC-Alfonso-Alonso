const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");
const examenInput = document.getElementById("examen");
const practicaInput = document.getElementById("practica");
const mensajeError = document.getElementById("mensajeError");
const notaMinima = document.getElementById("notaMinima");
const listaHistorial = document.getElementById("listaHistorial");
const historialVacio = document.getElementById("historialVacio");
const borrarHistorial = document.getElementById("borrarHistorial");
const claveHistorial = "historialCalculadoraNotas";

function obtenerNota(input) {
    return parseFloat(input.value.replace(",", "."));
}

function validarNota(input) {
    const valor = input.value.trim();
    const nota = obtenerNota(input);
    const esValida = valor !== "" && Number.isFinite(nota) && nota >= 0 && nota <= 10;

    input.classList.toggle("campo-error", !esValida);
    input.setAttribute("aria-invalid", String(!esValida));

    return esValida;
}

function actualizarNotaMinima() {
    const practica = obtenerNota(practicaInput);

    if (practicaInput.value.trim() === "" || !Number.isFinite(practica) || practica < 0 || practica > 10) {
        notaMinima.textContent = "";
        return;
    }

    const minima = Math.max(0, 10 - practica);
    notaMinima.textContent = "Necesitas al menos un " + minima.toFixed(2) + " en el examen para aprobar.";
}

function mostrarError() {
    const examenValido = validarNota(examenInput);
    const practicaValida = validarNota(practicaInput);

    if (!examenValido || !practicaValida) {
        mensajeError.textContent = "Introduce notas entre 0 y 10 en ambos campos.";
        resultado.textContent = "";
        resultado.className = "";
        return false;
    }

    mensajeError.textContent = "";
    return true;
}

function obtenerCalificacion(media) {
    if (media < 5) return "Insuficiente";
    if (media < 6) return "Suficiente";
    if (media < 7) return "Bien";
    if (media < 9) return "Notable";
    return "Sobresaliente";
}

function mostrarResultado(guardar) {
    if (!mostrarError()) return;

    const examen = obtenerNota(examenInput);
    const practica = obtenerNota(practicaInput);
    const media = (examen + practica) / 2;
    const notaFinal = media.toFixed(2);
    const aprobado = media >= 5;
    const calificacion = obtenerCalificacion(media);

    resultado.textContent = "Nota media: " + notaFinal + " - " + calificacion;
    resultado.className = aprobado ? "aprobado" : "suspenso";

    if (guardar) {
        guardarCalculo(examen, practica, notaFinal, calificacion);
    }
}

function leerHistorial() {
    try {
        return JSON.parse(localStorage.getItem(claveHistorial)) || [];
    } catch (error) {
        return [];
    }
}

function guardarCalculo(examen, practica, media, calificacion) {
    const historial = leerHistorial();
    historial.unshift({ examen, practica, media, calificacion });
    localStorage.setItem(claveHistorial, JSON.stringify(historial.slice(0, 10)));
    mostrarHistorial();
}

function mostrarHistorial() {
    const historial = leerHistorial();
    listaHistorial.textContent = "";
    historialVacio.hidden = historial.length > 0;
    borrarHistorial.disabled = historial.length === 0;

    historial.forEach(function(calculo) {
        const elemento = document.createElement("li");
        elemento.textContent = "Examen: " + calculo.examen + " | Práctica: " + calculo.practica +
            " | Media: " + calculo.media + " - " + calculo.calificacion;
        listaHistorial.appendChild(elemento);
    });
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    mostrarResultado(true);
});

examenInput.addEventListener("input", function() {
    actualizarNotaMinima();
    mostrarResultado(false);
});

practicaInput.addEventListener("input", function() {
    actualizarNotaMinima();
    mostrarResultado(false);
});

borrarHistorial.addEventListener("click", function() {
    localStorage.removeItem(claveHistorial);
    mostrarHistorial();
});

mostrarHistorial();