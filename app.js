// ==========================================
// FIREBASE
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
   getDoc,
   doc,
    updateDoc,
    setDoc,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDyDugE_7ox6iuMuzXB77fNlnUyw0eNTEY",
    authDomain: "ruletainstaarmy.firebaseapp.com",
    projectId: "ruletainstaarmy",
    storageBucket: "ruletainstaarmy.firebasestorage.app",
    messagingSenderId: "583239690513",
    appId: "1:583239690513:web:f43e0dc1e7eb5b873d84b0",
    measurementId: "G-FLLM7G9PEN"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

console.log("Firebase conectado");


console.log("PWA de la ruleta iniciada");


// ==========================================
// ELEMENTOS
// ==========================================

const btnGirar = document.getElementById("btnGirar");

const audioFestejo =
    document.getElementById("audioFestejo");

const btnRedes = document.getElementById("btnRedes");

const btnPanel =
    document.getElementById("btnPanel");

const modalPanel =
    document.getElementById("modalPanel");

    console.log("MODAL PANEL:", modalPanel);

const cerrarPanel =
    document.getElementById("cerrarPanel");

const cerrarPanelAdmin =
    document.getElementById("cerrarPanelAdmin");

const btnVolverDesdeRegistros =
    document.getElementById("btnVolverDesdeRegistros");

const btnVolverDesdeGanadores =
    document.getElementById("btnVolverDesdeGanadores");

const btnVolverDesdePremios =
    document.getElementById("btnVolverDesdePremios");

const modalInstrucciones =
    document.getElementById("modalInstrucciones");

const cerrarInstrucciones =
    document.getElementById("cerrarInstrucciones");

cerrarInstrucciones.addEventListener(
    "click",
    () => {

        modalInstrucciones.style.display =
            "none";

    }
);

// ==========================================
// VOLVER AL PANEL DESDE GANADORES
// ==========================================

if (btnVolverDesdeGanadores) {

    btnVolverDesdeGanadores.onclick = function () {

        console.log(
            "BOTÓN VOLVER DESDE GANADORES FUNCIONA"
        );

        modalGanadoresAdmin.style.display =
            "none";

        panelAdmin.style.display =
            "flex";
    };

}

    const formPanelLogin =
    document.getElementById("formPanelLogin");

const correoAdmin =
    document.getElementById("correoAdmin");

const passwordAdmin =
    document.getElementById("passwordAdmin");

const mensajePanel =
    document.getElementById("mensajePanel");

    const panelAdmin =
    document.getElementById("panelAdmin");

const btnReiniciarPartida =
    document.getElementById("btnReiniciarPartida");

const btnAdministrarPremios =
    document.getElementById("btnAdministrarPremios");

const modalPremiosAdmin =
    document.getElementById("modalPremiosAdmin");

const cerrarPremiosAdmin =
    document.getElementById("cerrarPremiosAdmin");

// ==========================================
// INICIAR SESIÓN DEL ADMINISTRADOR
// ==========================================

formPanelLogin.addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo =
        correoAdmin.value.trim();

    const password =
        passwordAdmin.value;

    mensajePanel.textContent =
        "Comprobando acceso...";

    try {

        // ==========================================
        // INICIAR SESIÓN EN FIREBASE
        // ==========================================

        await signInWithEmailAndPassword(
            auth,
            correo,
            password
        );

        console.log(
            "Administrador autenticado"
        );

        // ==========================================
        // COMPROBAR SI ES ADMINISTRADOR
        // ==========================================

        const usuario =
            auth.currentUser;

        const adminRef =
            doc(
                db,
                "administradores",
                usuario.uid
            );

        const adminSnap =
            await getDoc(adminRef);

        if (!adminSnap.exists()) {

            console.log(
                "El usuario no es administrador."
            );

            mensajePanel.textContent =
                "No tienes permiso para entrar al panel.";

            await signOut(auth);

            return;
        }

        console.log(
            "Administrador autorizado"
        );

        mensajePanel.textContent =
            "Acceso autorizado.";

        // ==========================================
        // MOSTRAR PANEL ADMINISTRATIVO
        // ==========================================

        modalPanel.style.display =
            "none";

        panelAdmin.style.display =
            "flex";

    } catch (error) {

        console.error(
            "ERROR REAL:",
            error
        );

        console.error(
            "Código:",
            error.code
        );

        console.error(
            "Mensaje:",
            error.message
        );

        if (
            error.code ===
            "auth/too-many-requests"
        ) {

            mensajePanel.textContent =
                "Demasiados intentos. Espera unos minutos.";

        } else if (
            error.code ===
            "auth/invalid-credential"
        ) {

            mensajePanel.textContent =
                "Correo o contraseña incorrectos.";

        } else {

            mensajePanel.textContent =
                "Error: " + error.message;
        }
    }

});


// ==========================================
// REINICIAR PARTIDA
// ==========================================

btnReiniciarPartida.addEventListener(
    "click",
    async () => {

        const confirmar = confirm(
            "¿Estás seguro de que quieres reiniciar la partida?\n\n" +
            "Los participantes podrán volver a jugar."
        );

        if (!confirmar) {
            return;
        }

        console.log(
            "Reiniciando partida..."
        );

        try {

            // ==========================================
            // OBTENER PARTICIPANTES
            // ==========================================

            const participantesRef =
                collection(
                    db,
                    "participantes"
                );

            const participantesSnap =
                await getDocs(
                    participantesRef
                );

            const batch =
                writeBatch(db);

            // ==========================================
            // PERMITIR QUE VUELVAN A JUGAR
            // ==========================================

            participantesSnap.forEach(
                (participante) => {

                    const participanteRef =
                        doc(
                            db,
                            "participantes",
                            participante.id
                        );

                    batch.update(
                        participanteRef,
                        {
                            yaJugo: false
                        }
                    );

                }
            );

            // ==========================================
            // ACTUALIZAR PARTIDA
            // ==========================================

            const partidaRef =
                doc(
                    db,
                    "partidas",
                    "partida1"
                );

            batch.update(
                partidaRef,
                {
                    activa: true,
                    fechaInicio:
                        serverTimestamp()
                }
            );

            // ==========================================
            // GUARDAR CAMBIOS
            // ==========================================

            await batch.commit();

            console.log(
                "Partida reiniciada correctamente"
            );

            alert(
                "💜 Partida reiniciada correctamente.\n\n" +
                "Los participantes ya pueden volver a jugar."
            );

        } catch (error) {

            console.error(
                "Error al reiniciar partida:",
                error
            );

            console.error(
                "Código:",
                error.code
            );

            console.error(
                "Mensaje:",
                error.message
            );

            alert(
                "❌ No se pudo reiniciar la partida."
            );
        }

    }
);
// ==========================================
// ABRIR ADMINISTRACIÓN DE PREMIOS
// ==========================================

btnAdministrarPremios.addEventListener(
    "click",
    async () => {

        console.log(
            "BOTÓN ADMINISTRAR PREMIOS FUNCIONA"
        );

        modalPremiosAdmin.style.display =
            "flex";

        await cargarPremiosAdmin();

    }
);


// ==========================================
// CARGAR PREMIOS DESDE FIRESTORE
// ==========================================

async function cargarPremiosAdmin() {

    const lista =
        document.getElementById(
            "listaPremiosAdmin"
        );

    lista.innerHTML =
        "<p>Cargando premios...</p>";

    try {

        const premiosRef =
            collection(
                db,
                "premios"
            );

        const premiosSnap =
            await getDocs(
                premiosRef
            );

        console.log(
            "Premios encontrados:",
            premiosSnap.size
        );


        // ==========================================
        // COMPROBAR SI HAY PREMIOS
        // ==========================================

        if (premiosSnap.empty) {

            lista.innerHTML =
                "<p>No hay premios registrados.</p>";

            return;
        }


        lista.innerHTML = "";


        // ==========================================
        // CREAR TARJETAS DE PREMIOS
        // ==========================================

        premiosSnap.forEach(
            (premioDoc) => {

                const premio =
                    premioDoc.data();

                const cantidadTotal =
                    Number(
                        premio.cantidadTotal ?? 0
                    );

                const cantidadDisponible =
                    Number(
                        premio.cantidadDisponible ?? 0
                    );


                const tarjeta =
                    document.createElement(
                        "div"
                    );

                tarjeta.className =
                    "premio-admin-item";


                tarjeta.innerHTML = `

                    <h3>
                        🎁 ${premio.nombre || premioDoc.id}
                    </h3>

                    <p>
                        Cantidad total:
                        <strong>
                            ${cantidadTotal}
                        </strong>
                    </p>

                    <p>
                        Cantidad disponible:
                        <strong>
                            ${cantidadDisponible}
                        </strong>
                    </p>

                    <div class="controles-premio">

                        <button
                            type="button"
                            class="btn-cantidad"
                            data-id="${premioDoc.id}"
                            data-accion="restar"
                        >
                            −
                        </button>

                        <span class="cantidad-actual">
                            ${cantidadDisponible}
                        </span>

                        <button
                            type="button"
                            class="btn-cantidad"
                            data-id="${premioDoc.id}"
                            data-accion="sumar"
                        >
                            +
                        </button>

                    </div>

                `;


                lista.appendChild(
                    tarjeta
                );

            }
        );


        // ==========================================
        // BOTONES + Y -
        // ==========================================

        const botonesCantidad =
            document.querySelectorAll(
                ".btn-cantidad"
            );


        botonesCantidad.forEach(
            (boton) => {

                boton.addEventListener(
                    "click",
                    async () => {

                        const premioId =
                            boton.dataset.id;

                        const accion =
                            boton.dataset.accion;


                        await cambiarCantidadPremio(
                            premioId,
                            accion
                        );

                    }
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar premios:",
            error
        );

        lista.innerHTML =
            "<p>❌ No se pudieron cargar los premios.</p>";
    }

}


// ==========================================
// CAMBIAR CANTIDAD DISPONIBLE
// ==========================================

async function cambiarCantidadPremio(
    premioId,
    accion
) {

    try {

        const premioRef =
            doc(
                db,
                "premios",
                premioId
            );


        const premioSnap =
            await getDoc(
                premioRef
            );


        if (!premioSnap.exists()) {

            console.error(
                "El premio no existe:",
                premioId
            );

            return;
        }


        const premio =
            premioSnap.data();


        const cantidadTotal =
            Number(
                premio.cantidadTotal ?? 0
            );


        let cantidadDisponible =
            Number(
                premio.cantidadDisponible ?? 0
            );


        // ==========================================
        // SUMAR
        // ==========================================

        if (accion === "sumar") {

            if (
                cantidadDisponible >=
                cantidadTotal
            ) {

                alert(
                    "La cantidad disponible no puede superar la cantidad total."
                );

                return;
            }

            cantidadDisponible++;
        }


        // ==========================================
        // RESTAR
        // ==========================================

        if (accion === "restar") {

            if (
                cantidadDisponible <= 0
            ) {

                alert(
                    "La cantidad disponible no puede ser menor que 0."
                );

                return;
            }

            cantidadDisponible--;
        }


        // ==========================================
        // GUARDAR EN FIRESTORE
        // ==========================================

        await updateDoc(
            premioRef,
            {
                cantidadDisponible:
                    cantidadDisponible
            }
        );


        console.log(
            "Cantidad actualizada:",
            premioId,
            cantidadDisponible
        );


        // ==========================================
        // RECARGAR PREMIOS
        // ==========================================

        await cargarPremiosAdmin();


    } catch (error) {

        console.error(
            "Error al cambiar cantidad:",
            error
        );

        alert(
            "❌ No se pudo actualizar la cantidad."
        );
    }

}
// ==========================================
// AGREGAR NUEVO PREMIO
// ==========================================

const btnAgregarPremio =
    document.getElementById("btnAgregarPremio");

const formAgregarPremio =
    document.getElementById("formAgregarPremio");

const btnGuardarNuevoPremio =
    document.getElementById("btnGuardarNuevoPremio");

const btnCancelarNuevoPremio =
    document.getElementById("btnCancelarNuevoPremio");

const nombreNuevoPremio =
    document.getElementById("nombreNuevoPremio");

const cantidadTotalNuevoPremio =
    document.getElementById("cantidadTotalNuevoPremio");

const colorNuevoPremio =
    document.getElementById("colorNuevoPremio");


// ==========================================
// MOSTRAR FORMULARIO
// ==========================================

btnAgregarPremio.addEventListener(
    "click",
    () => {

        formAgregarPremio.style.display =
            "block";

        nombreNuevoPremio.focus();

    }
);


// ==========================================
// CANCELAR
// ==========================================

btnCancelarNuevoPremio.addEventListener(
    "click",
    () => {

        formAgregarPremio.style.display =
            "none";

        nombreNuevoPremio.value = "";

        cantidadTotalNuevoPremio.value = "1";

        colorNuevoPremio.value = "";

    }
);


// ==========================================
// GUARDAR NUEVO PREMIO
// ==========================================

btnGuardarNuevoPremio.addEventListener(
    "click",
    async () => {

        const nombre =
            nombreNuevoPremio.value.trim();

        const cantidadTotal =
            Number(
                cantidadTotalNuevoPremio.value
            );

        const color =
            colorNuevoPremio.value.trim();


        // ==========================================
        // VALIDAR NOMBRE
        // ==========================================

        if (!nombre) {

            alert(
                "⚠️ Escribe el nombre del premio."
            );

            nombreNuevoPremio.focus();

            return;
        }


        // ==========================================
        // VALIDAR CANTIDAD
        // ==========================================

        if (
            !Number.isInteger(cantidadTotal) ||
            cantidadTotal < 1
        ) {

            alert(
                "⚠️ La cantidad total debe ser un número entero mayor que 0."
            );

            cantidadTotalNuevoPremio.focus();

            return;
        }


        // ==========================================
        // GUARDAR EN FIRESTORE
        // ==========================================

        try {

            console.log(
                "Guardando nuevo premio..."
            );


            const premiosRef =
                collection(
                    db,
                    "premios"
                );


            const nuevoPremioRef =
                doc(
                    premiosRef
                );


            await setDoc(
                nuevoPremioRef,
                {
                    nombre: nombre,
                    cantidadTotal: cantidadTotal,
                    cantidadDisponible: cantidadTotal,
                    color: color,
                    codigoBoton: ""
                }
            );


            console.log(
                "Premio creado:",
                nuevoPremioRef.id
            );


            alert(
                "💜 Premio agregado correctamente."
            );


            // ==========================================
            // LIMPIAR FORMULARIO
            // ==========================================

            nombreNuevoPremio.value =
                "";

            cantidadTotalNuevoPremio.value =
                "1";

            colorNuevoPremio.value =
                "";


            formAgregarPremio.style.display =
                "none";


            // ==========================================
            // ACTUALIZAR LISTA
            // ==========================================

            await cargarPremiosAdmin();


        } catch (error) {

            console.error(
                "Error al crear premio:",
                error
            );

            console.error(
                "Código:",
                error.code
            );

            console.error(
                "Mensaje:",
                error.message
            );


            alert(
                "❌ No se pudo crear el premio."
            );

        }

    }
);

// ==========================================
// CERRAR ADMINISTRACIÓN DE PREMIOS
// ==========================================

cerrarPremiosAdmin.addEventListener(
    "click",
    () => {

        modalPremiosAdmin.style.display = "none";

    }
);
// ==========================================
// VOLVER AL PANEL DESDE PREMIOS
// ==========================================

if (btnVolverDesdePremios) {

    btnVolverDesdePremios.onclick = function () {

        console.log(
            "BOTÓN VOLVER DESDE PREMIOS FUNCIONA"
        );

        modalPremiosAdmin.style.display =
            "none";

        panelAdmin.style.display =
            "flex";

    };

}
// ==========================================
// ELEMENTOS - REGISTROS Y GANADORES
// ==========================================

const btnVerRegistros =
    document.getElementById("btnVerRegistros");

const modalRegistrosAdmin =
    document.getElementById("modalRegistrosAdmin");

const cerrarRegistrosAdmin =
    document.getElementById("cerrarRegistrosAdmin");

const listaRegistrosAdmin =
    document.getElementById("listaRegistrosAdmin");


const btnVerGanadores =
    document.getElementById("btnVerGanadores");

const modalGanadoresAdmin =
    document.getElementById("modalGanadoresAdmin");

const cerrarGanadoresAdmin =
    document.getElementById("cerrarGanadoresAdmin");

const listaGanadoresAdmin =
    document.getElementById("listaGanadoresAdmin");


// ==========================================
// VER REGISTROS
// ==========================================

btnVerRegistros.addEventListener(
    "click",
    async () => {

        console.log(
            "BOTÓN VER REGISTROS FUNCIONA"
        );

        modalRegistrosAdmin.style.display =
            "flex";

        listaRegistrosAdmin.innerHTML =
            "<p>Cargando registros...</p>";

        try {

            const participantesRef =
                collection(
                    db,
                    "participantes"
                );

            const participantesSnap =
                await getDocs(
                    participantesRef
                );

            console.log(
                "Registros encontrados:",
                participantesSnap.size
            );

            if (participantesSnap.empty) {

                listaRegistrosAdmin.innerHTML =
                    "<p>No hay participantes registrados.</p>";

                return;
            }

            listaRegistrosAdmin.innerHTML =
                "";

            participantesSnap.forEach(
                (participanteDoc) => {

                    const participante =
                        participanteDoc.data();

                    const tarjeta =
                        document.createElement(
                            "div"
                        );

                    tarjeta.className =
                        "registro-admin-item";

                    tarjeta.innerHTML = `

                        <h3>
                            👤 ${
                                participante.nombre ||
                                "Sin nombre"
                            }
                        </h3>

                        <p>
                            Código:
                            <strong>
                                ${
                                    participante.codigo ||
                                    "Sin código"
                                }
                            </strong>
                        </p>

                        <p>
     País:
    <strong>
        ${
            participante.pais ||
            "Sin país"
        }
    </strong>
</p>

                        <p>
                            Estado:
                            <strong>
                                ${
                                    participante.yaJugo
                                        ? "Ya jugó"
                                        : "No ha jugado"
                                }
                            </strong>
                        </p>

                    `;

                    listaRegistrosAdmin.appendChild(
                        tarjeta
                    );

                }
            );
            // ==========================================
// VOLVER AL PANEL DESDE REGISTROS
// ==========================================

if (btnVolverDesdeRegistros) {

    btnVolverDesdeRegistros.addEventListener(
        "click",
        () => {

            modalRegistrosAdmin.style.display =
                "none";

            panelAdmin.style.display =
                "flex";

            console.log(
                "REGRESANDO AL PANEL DESDE REGISTROS"
            );

        }
    );

}

        } catch (error) {

            console.error(
                "Error al cargar registros:",
                error
            );

            listaRegistrosAdmin.innerHTML =
                "<p>❌ No se pudieron cargar los registros.</p>";
        }

    }
);


// ==========================================
// CERRAR REGISTROS
// ==========================================

cerrarRegistrosAdmin.addEventListener(
    "click",
    () => {

        modalRegistrosAdmin.style.display =
            "none";

    }
);


// ==========================================
// VER GANADORES
// ==========================================

btnVerGanadores.addEventListener(
    "click",
    async () => {

        console.log(
            "BOTÓN VER GANADORES FUNCIONA"
        );

        modalGanadoresAdmin.style.display =
            "flex";

        listaGanadoresAdmin.innerHTML =
            "<p>Cargando ganadores...</p>";

        try {

            const participantesRef =
                collection(
                    db,
                    "participantes"
                );

            const participantesSnap =
                await getDocs(
                    participantesRef
                );

            console.log(
                "Participantes revisados:",
                participantesSnap.size
            );

            listaGanadoresAdmin.innerHTML =
                "";

            let ganadoresEncontrados =
                0;

            participantesSnap.forEach(
                (participanteDoc) => {

                    const participante =
                        participanteDoc.data();

                    if (
                        participante.yaJugo === true &&
                        participante.premio
                    ) {

                        ganadoresEncontrados++;

                        const tarjeta =
                            document.createElement(
                                "div"
                            );

                        tarjeta.className =
                            "ganador-admin-item";

                       tarjeta.innerHTML = `

    <h3>
        🏆 ${
            participante.nombre ||
            "Sin nombre"
        }
    </h3>

    <p>
        Código:
        <strong>
            ${
                participante.codigo ||
                "Sin código"
            }
        </strong>
    </p>
<p>
    País:
    <strong>
        ${
            participante.pais ||
            "Sin país"
        }
    </strong>
</p>
    <p>
        Premio:
        <strong>
            ${
                participante.premio ||
                "Sin premio"
            }
        </strong>
    </p>

    <p>
        Sección:
        <strong>
            ${
                participante.seccion ||
                "Sin sección"
            }
        </strong>
    </p>
    <p>
    Fecha:
    <strong>
        ${
            participante.fechaPremio
                ? participante.fechaPremio.toDate().toLocaleString("es-MX")
                : "Sin fecha"
        }
    </strong>
</p>

`;

                        listaGanadoresAdmin.appendChild(
                            tarjeta
                        );
                    }

                }
            );


            if (ganadoresEncontrados === 0) {

                listaGanadoresAdmin.innerHTML =
                    "<p>No hay ganadores todavía.</p>";
            }

            console.log(
                "Ganadores encontrados:",
                ganadoresEncontrados
            );

        } catch (error) {

            console.error(
                "Error al cargar ganadores:",
                error
            );

            listaGanadoresAdmin.innerHTML =
                "<p>❌ No se pudieron cargar los ganadores.</p>";
        }

    }
);


// ==========================================
// CERRAR GANADORES
// ==========================================

cerrarGanadoresAdmin.addEventListener(
    "click",
    () => {

        modalGanadoresAdmin.style.display =
            "none";

    }
);
  
    // ==========================================
// ABRIR PANEL DE ADMINISTRADOR
// ==========================================

btnPanel.addEventListener("click", () => {

    console.log("BOTÓN PANEL FUNCIONA");

    modalPanel.style.display = "flex";

});

// ==========================================
// CERRAR PANEL PRINCIPAL DE ADMINISTRACIÓN
// ==========================================

if (cerrarPanelAdmin) {

    cerrarPanelAdmin.addEventListener(
        "click",
        () => {

            panelAdmin.style.display = "none";

            console.log(
                "PANEL ADMINISTRACIÓN CERRADO"
            );

        }
    );

}
// ==========================================
// CERRAR PANEL DE ADMINISTRADOR
// ==========================================

cerrarPanel.addEventListener("click", () => {

    modalPanel.style.display = "none";

});
// ==========================================
// MODAL REDES SOCIALES
// ==========================================

const modalRedes =
    document.getElementById("modalRedes");

const cerrarRedes =
    document.getElementById("cerrarRedes");

const linkInstagram =
    document.getElementById("linkInstagram");

const linkFacebook =
    document.getElementById("linkFacebook");

const linkTikTok =
    document.getElementById("linkTikTok");

const linkYouTube =
    document.getElementById("linkYouTube");

const linkSpotify =
    document.getElementById("linkSpotify");

    // ==========================================
// ENLACES DE REDES SOCIALES
// ==========================================

linkInstagram.href =
    "https://www.instagram.com/instaarmyapp?igsh=cWJzZTRzbG5vbHpu";

linkFacebook.href =
    "https://www.facebook.com/share/18y5RX9tp9/?mibextid=wwXIfr";

linkTikTok.href =
    "https://www.tiktok.com/@.insta.army?_r=1&_t=ZS-98tM2hXvvuu";

linkYouTube.href =
    "https://youtube.com/channel/UCKKuZLrunJuyYP7A1NOZlJA?si=seESiyRWqsSWu3rv";

linkSpotify.href =
    "https://open.spotify.com/artist/2fEXfo7rF3GPNSxYSOG6Pt?si=4vmosX7sQXiR4X73PSlL5g&utm_source=copy-link&sci=spotify%3Acard-config%3A7jDthXh6L91wpvE1Elxpnl";

// ==========================================
// ABRIR REDES
// ==========================================

btnRedes.addEventListener("click", () => {

    console.log("BOTÓN REDES FUNCIONA");

    modalRedes.style.display = "block";

});


// ==========================================
// CERRAR REDES
// ==========================================

cerrarRedes.addEventListener("click", () => {

    modalRedes.style.display = "none";

});

const modalRegistro = document.getElementById("modalRegistro");
const cerrarRegistro = document.getElementById("cerrarRegistro");

const formRegistro = document.getElementById("formRegistro");

const ruleta = document.getElementById("ruleta");

// ==========================================
// AUDIOS
// ==========================================

const audioInicio = new Audio("inicioaudio.mp3");

const audioRuleta = new Audio("sonidoruleta.mp3");

audioInicio.loop = true;

// ==========================================
// INICIAR AUDIO CON LA PRIMERA INTERACCIÓN
// ==========================================

function iniciarAudioInicio() {

    audioInicio.play().catch(() => {
        console.log("El navegador bloqueó el audio automático.");
    });

    document.removeEventListener(
        "click",
        iniciarAudioInicio
    );
}

document.addEventListener(
    "click",
    iniciarAudioInicio
);


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

const modalResultado =
    document.getElementById("modalResultado");


const resultadoImagen =
    document.getElementById("resultadoImagen");

const cerrarResultado =
    document.getElementById("cerrarResultado");


function mostrarResultado(nombre, premio, indicePremio) {

    resultadoImagen.src =
        `premio${indicePremio + 1}.png`;

    modalResultado.style.display = "flex";

}





// ==========================================
// CERRAR RESULTADO
// ==========================================

cerrarResultado.addEventListener("click", () => {

    modalResultado.style.display = "none";

});
// ==========================================
// ESTADO DEL USUARIO
// ==========================================

btnGirar.dataset.registrado = "false";

let participanteId = null;



// ==========================================
// VALIDAR CÓDIGO DE CREDENCIAL
// ==========================================

function codigoValido(codigo) {

    // Quitamos espacios y convertimos a mayúsculas.

    const codigoNormalizado = codigo
        .trim()
        .toUpperCase();


    /*
     * A1 - A999
     */

    const codigoA = /^A([1-9][0-9]{0,2})$/;


    /*
     * AK0 - AK999
     */

    const codigoAK = /^AK([0-9]{1,3})$/;


    /*
     * 2K0 - 2K999
     */

    const codigo2K = /^2K([0-9]{1,3})$/;


    /*
     * 3K1 - 3K999
     */

    const codigo3K = /^3K([1-9][0-9]{0,2})$/;


    /*
     * 4K1 - 4K999
     */

    const codigo4K = /^4K([1-9][0-9]{0,2})$/;


    /*
     * 5K1 - 5K999
     */

    const codigo5K = /^5K([1-9][0-9]{0,2})$/;


    // Comprobamos todos los formatos.

    if (
        codigoA.test(codigoNormalizado) ||
        codigoAK.test(codigoNormalizado) ||
        codigo2K.test(codigoNormalizado) ||
        codigo3K.test(codigoNormalizado) ||
        codigo4K.test(codigoNormalizado) ||
        codigo5K.test(codigoNormalizado)
    ) {

        return true;

    }


    return false;
}


// ==========================================
// BOTÓN GIRAR RULETA
// ==========================================

btnGirar.addEventListener("click", () => {

    const registrado =
        btnGirar.dataset.registrado === "true";


    if (!registrado) {

        modalRegistro.classList.add("mostrar");

        return;
    }



// Detener audio de inicio

audioInicio.pause();

audioInicio.currentTime = 0;
// ==========================================
// GIRAR RULETA
// ==========================================

// Bloqueamos el botón inmediatamente.

btnGirar.disabled = true;

btnGirar.style.pointerEvents = "none";


// ==========================================
// PREMIOS DE LA RULETA
// ==========================================

const premios = [
    {
        nombre: "RM",
        premio: "Navidad"
    },
    {
        nombre: "Jin",
        premio: "Día de muertos"
    },
    {
        nombre: "Suga",
        premio: "Diploma"
    },
    {
        nombre: "J-Hope",
        premio: "Acta de bautismo"
    },
    {
        nombre: "Jimin",
        premio: "Camiseta"
    },
    {
        nombre: "Jungkook",
        premio: "Calca bancarias"
    },
    {
        nombre: "V",
        premio: "Etiqueta Cola"
    }
];


// ==========================================
// ELEGIR PREMIO
// ==========================================

const premioGanador = 4;

const premioSeleccionado =
    premios[premioGanador];

const nombrePremio =
    premioSeleccionado.nombre;

const premioGanado =
    premioSeleccionado.premio;

    console.log("Índice elegido:", premioGanador);
console.log("Sección elegida:", nombrePremio);
console.log("Premio elegido:", premioGanado);

// ==========================================
// COMPROBACIÓN
// ==========================================

console.log("Índice elegido:", premioGanador);

console.log("Sección elegida:", nombrePremio);

console.log("Premio elegido:", premioGanado);;

// ==========================================
// CALCULAR GIRO
// ==========================================

// Cada premio ocupa 1/7 de la ruleta.

const gradosPorPremio = 360 / 7;


// Cinco vueltas completas.

const vueltas = 5;


// Calculamos la posición del premio elegido.

const posicionPremio =
    premioGanador * gradosPorPremio;


// Giramos hasta colocar el premio
// frente a la flecha.

const grados =
    (360 * vueltas) +
    (360 - posicionPremio);


// Hacemos girar la ruleta.

ruleta.style.transform =
    `rotate(${grados}deg)`;

    // ==========================================
// SONIDO DE LA RULETA
// ==========================================
audioRuleta.currentTime = 0;

audioRuleta.play().catch(() => {
    console.log("No se pudo reproducir el sonido de la ruleta.");
});


setTimeout(async () => {

    // Detener sonido de la ruleta

    audioRuleta.pause();

    audioRuleta.currentTime = 0;


    // ==========================================
    // MOSTRAR PREMIO GANADOR
    // ==========================================

    // ==========================================
// GUARDAR PREMIO EN FIRESTORE
// ==========================================

await updateDoc(
    doc(db, "participantes", participanteId),
    {
        premio: premioGanado,
        seccion: nombrePremio,
        yaJugo: true,
        fechaPremio: serverTimestamp()
    }
);

console.log("Premio guardado en Firestore");

console.log("Participante:", participanteId);

console.log("Sección:", nombrePremio);

console.log("Premio:", premioGanado);


// ==========================================
// SONIDO DE FESTEJO AL MOSTRAR EL PREMIO
// ==========================================

audioFestejo.currentTime = 0;

audioFestejo.play().catch(() => {
    console.log(
        "No se pudo reproducir el sonido de festejo."
    );
});

mostrarResultado(
    nombrePremio,
    premioGanado,
    premioGanador
);
}, 5000);

console.log("La ruleta está girando.");

});
// ==========================================
// CERRAR REGISTRO
// ==========================================

cerrarRegistro.addEventListener("click", () => {

    modalRegistro.classList.remove("mostrar");

});


// ==========================================
// FORMULARIO DE REGISTRO
// ==========================================

formRegistro.addEventListener("submit", async (evento) => {

    evento.preventDefault();


    // ==========================================
    // OBTENER DATOS
    // ==========================================

   const nombre =
    document.getElementById("nombreUsuario").value.trim();


const codigoOriginal =
    document.getElementById("codigoCredencial").value.trim();

    const pais =
    document.getElementById("paisUsuario").value.trim();



    // ==========================================
    // COMPROBAR NOMBRE
    // ==========================================

    if (!nombre) {

        alert("Por favor, escribe tu nombre.");

        return;
    }
    
    if (!pais) {

    alert("Por favor, escribe tu país.");

    return;
}


    // ==========================================
    // NORMALIZAR CÓDIGO
    // ==========================================

    const codigo =
        codigoOriginal.toUpperCase().replace(/\s+/g, "");


    // ==========================================
    // COMPROBAR CÓDIGO
    // ==========================================

    if (!codigoValido(codigo)) {

        alert(
            "El código de credencial no es válido.\n\n" +
            "Revisa que hayas escrito correctamente tu código."
        );

        return;
    }


    // ==========================================
// GUARDAR PARTICIPANTE EN FIRESTORE
// ==========================================

try {

    // ------------------------------------------
    // Comprobar si el código ya está registrado
    // en la partida actual
    // ------------------------------------------

    const participantesRef = collection(db, "participantes");

    const consulta = query(
        participantesRef,
        where("codigo", "==", codigo),
        where("partidaId", "==", "partida1")
    );

    const resultado = await getDocs(consulta);


    // ------------------------------------------
    // Si ya existe, no permitimos registrarlo otra vez
    // ------------------------------------------

  if (!resultado.empty) {

    const participanteExistente =
        resultado.docs[0];

    const datosParticipante =
        participanteExistente.data();

    if (datosParticipante.yaJugo === true) {

        alert(
            "Este código ya jugó en esta partida."
        );

        return;
    }

    // El participante existe,
    // pero yaJugo es false.
    // Puede volver a jugar.

    participanteId =
        participanteExistente.id;

    console.log(
        "Participante puede volver a jugar:",
        participanteId
    );

} else {

 

    // ------------------------------------------
    // Crear participante
    // ------------------------------------------

    const participanteDoc = await addDoc(participantesRef, {

    nombre: nombre,

    codigo: codigo,

    pais: pais,

    partidaId: "partida1",

    yaJugo: false,

    fechaRegistro: serverTimestamp()

});

participanteId = participanteDoc.id;

    // ------------------------------------------
    // Confirmación
    // ------------------------------------------

    console.log("Participante guardado en Firestore");

    console.log("Nombre:", nombre);

    console.log("Código:", codigo);

     console.log("País:", pais);

}

} catch (error) {

   console.error(
    "Error al guardar el participante:",
    error
);

console.error(
    "Código del error:",
    error.code
);

console.error(
    "Mensaje del error:",
    error.message
);

    alert(
        "No se pudo completar el registro. " +
        "Revisa tu conexión e inténtalo nuevamente."
    );

    return;
}


    // ==========================================
    // USUARIO REGISTRADO
    // ==========================================

    btnGirar.dataset.registrado = "true";


    btnGirar.setAttribute(
        "aria-disabled",
        "false"
    );


    // Cerramos la ventana.

    modalRegistro.classList.remove("mostrar");


    console.log(
        "Registro completado. El usuario puede jugar."
    );

});

// ==========================================
// INSTALACIÓN DE LA PWA
// ==========================================

let deferredPrompt = null;

const btnInstalar =
    document.getElementById("btnInstalar");


// ==========================================
// DETECTAR CUANDO EL NAVEGADOR PERMITE
// INSTALAR LA PWA
// ==========================================

window.addEventListener(
    "beforeinstallprompt",
    (event) => {

        event.preventDefault();

        deferredPrompt = event;

        console.log(
            "La PWA puede instalarse."
        );

        if (btnInstalar) {

            btnInstalar.style.display =
                "flex";

        }

    }
);


// ==========================================
// BOTÓN INSTALAR
// ==========================================

if (btnInstalar) {

    btnInstalar.addEventListener(
        "click",
        async () => {

            console.log(
                "BOTÓN INSTALAR FUNCIONA"
            );

            if (!deferredPrompt) {

                alert(
                    "La opción de instalación no está disponible en este momento."
                );

                return;
            }

            deferredPrompt.prompt();

            const resultado =
                await deferredPrompt.userChoice;

            console.log(
                "Resultado de instalación:",
                resultado.outcome
            );

            deferredPrompt = null;

        }
    );

}


// ==========================================
// DETECTAR CUANDO LA PWA YA FUE INSTALADA
// ==========================================

window.addEventListener(
    "appinstalled",
    () => {

        console.log(
            "PWA instalada correctamente."
        );

        if (btnInstalar) {

            btnInstalar.style.display =
                "none";

        }

    }
);
