// ============================================
// IDIOMAS
// ============================================

let idiomaActual = 'es';

const mensajes = {
    es: {
        errorValoresInvalidos: "⚠️ Por favor ingresa valores numéricos válidos en todos los campos.",
        errorPuntosIdenticos: "⚠️ Los dos puntos son idénticos. Por favor ingresa dos puntos diferentes.",
        atencionLineaVertical: "⚠️ ¡Atención! Los dos puntos tienen la misma coordenada X.",
        lineaVerticalTexto: "Esto forma una línea VERTICAL con ecuación:",
        lineaVerticalIndefinida: "Las líneas verticales tienen pendiente INDEFINIDA (no se puede calcular).",
        resultadoTitulo: "Resultado:",
        pendienteTexto: "La pendiente de esta recta es",
        ecuacionTexto: "La ecuación de tu recta es:"
    },
    en: {
        errorValoresInvalidos: "⚠️ Please enter valid numeric values in all fields.",
        errorPuntosIdenticos: "⚠️ Both points are identical. Please enter two different points.",
        atencionLineaVertical: "⚠️ Attention! Both points have the same X coordinate.",
        lineaVerticalTexto: "This forms a VERTICAL line with equation:",
        lineaVerticalIndefinida: "Vertical lines have UNDEFINED slope (cannot be calculated).",
        resultadoTitulo: "Result:",
        pendienteTexto: "The slope of this line is",
        ecuacionTexto: "The equation of your line is:"
    }
};

function cambiarIdioma(idioma) {
    idiomaActual = idioma;
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === idioma) {
            btn.classList.add('active');
        }
    });
    
    // Actualizar todos los textos con atributos data-es y data-en
    document.querySelectorAll('[data-es]').forEach(elemento => {
        const textoEs = elemento.getAttribute('data-es');
        const textoEn = elemento.getAttribute('data-en');
        
        if (elemento.tagName === 'INPUT') {
            // Para inputs, actualizar placeholder
            const placeholderEs = elemento.getAttribute('data-es-placeholder');
            const placeholderEn = elemento.getAttribute('data-en-placeholder');
            if (placeholderEs && placeholderEn) {
                elemento.placeholder = idioma === 'es' ? placeholderEs : placeholderEn;
            }
        } else if (elemento.tagName === 'BUTTON' || elemento.tagName === 'LABEL' || elemento.tagName === 'P' || elemento.tagName === 'STRONG' || elemento.tagName === 'H1' || elemento.tagName === 'H3' || elemento.tagName === 'TITLE') {
            elemento.textContent = idioma === 'es' ? textoEs : textoEn;
        }
    });
    
    // Actualizar el atributo lang del documento
    document.documentElement.lang = idioma;
}

// ============================================
// FUNCIONES DE FORMATO
// ============================================

// Función para formatear números: enteros sin decimales, decimales con 2 decimales
function formatearNumero(numero) {
    if (Number.isInteger(numero)) {
        return numero.toString();
    } else {
        // Redondear a 2 decimales y eliminar ceros innecesarios
        return parseFloat(numero.toFixed(2)).toString();
    }
}

// ============================================
// FUNCIÓN DE LIMPIEZA
// ============================================

function limpiar() {
    document.getElementById('x1').value = '';
    document.getElementById('y1').value = '';
    document.getElementById('x2').value = '';
    document.getElementById('y2').value = '';
    
    const resultado = document.getElementById('resultado');
    resultado.classList.remove('show');
    resultado.innerHTML = '';
    
    // Remover clase calculated de todos los inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.classList.remove('calculated');
    });
}

// ============================================
// MANEJO DEL FORMULARIO
// ============================================

// Obtener el formulario
const formulario = document.getElementById('formularioPendiente');

// Manejar el envío del formulario
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Prevenir que se recargue la página
    
    // Obtener los valores de los inputs y limpiar espacios
    const coordenada_x1 = parseFloat(document.getElementById('x1').value.trim());
    const coordenada_y1 = parseFloat(document.getElementById('y1').value.trim());
    const coordenada_x2 = parseFloat(document.getElementById('x2').value.trim());
    const coordenada_y2 = parseFloat(document.getElementById('y2').value.trim());
    
    const divResultado = document.getElementById('resultado');
    
    // Validar que todos los valores sean números válidos
    if (isNaN(coordenada_x1) || isNaN(coordenada_y1) || isNaN(coordenada_x2) || isNaN(coordenada_y2)) {
        divResultado.innerHTML = `<p style="color: #8D584D;">${mensajes[idiomaActual].errorValoresInvalidos}</p>`;
        divResultado.classList.add('show');
        return;
    }
    
    // Verificar si los puntos son idénticos
    if (coordenada_x1 === coordenada_x2 && coordenada_y1 === coordenada_y2) {
        divResultado.innerHTML = `<p style="color: #8D584D;">${mensajes[idiomaActual].errorPuntosIdenticos}</p>`;
        divResultado.classList.add('show');
        return;
    }
    
    // Verificar si es una línea vertical (división por cero)
    if (coordenada_x2 === coordenada_x1) {
        divResultado.innerHTML = `
            <h2>${mensajes[idiomaActual].resultadoTitulo}</h2>
            <p style="color: #8D584D;"><strong>${mensajes[idiomaActual].atencionLineaVertical}</strong></p>
            <p>${mensajes[idiomaActual].lineaVerticalTexto}</p>
            <div class="equation-display vertical-line-equation">
                <span class="var-x">x</span> = ${formatearNumero(coordenada_x1)}
            </div>
            <p>${mensajes[idiomaActual].lineaVerticalIndefinida}</p>
        `;
        divResultado.classList.add('show');
        return;
    }
    
    // Calcular la pendiente
    let pendiente = (coordenada_y2 - coordenada_y1) / (coordenada_x2 - coordenada_x1);
    
    // Calcular el intercepto
    let intercepto = coordenada_y1 - (pendiente * coordenada_x1);
    
    // Construir la ecuación con formato correcto en estilo matemático con colores
    let ecuacion = '<span class="var-y">y</span> = <span class="var-m">m</span><span class="var-x">x</span>';
    
    if (intercepto >= 0.01 || intercepto <= -0.01) {
        if (intercepto > 0) {
            ecuacion += ' + <span class="var-b">b</span>';
        } else {
            ecuacion += ' − <span class="var-b">b</span>';
        }
    }
    
    // Construir la ecuación con valores reales y colores
    let ecuacionValores = '<span class="var-y">y</span> = <span class="var-m">' + formatearNumero(pendiente) + '</span><span class="var-x">x</span>';
    
    if (intercepto > 0.01) {
        ecuacionValores += ' + <span class="var-b">' + formatearNumero(intercepto) + '</span>';
    } else if (intercepto < -0.01) {
        ecuacionValores += ' − <span class="var-b">' + formatearNumero(Math.abs(intercepto)) + '</span>';
    }
    
    // Mostrar el resultado
    divResultado.innerHTML = `
        <h2>${mensajes[idiomaActual].resultadoTitulo}</h2>
        <p>${mensajes[idiomaActual].pendienteTexto}: <span class="slope-value"><span class="var-m">m</span> = <span class="var-m">${formatearNumero(pendiente)}</span></span></p>
        <p>${mensajes[idiomaActual].ecuacionTexto}</p>
        <div class="equation-display">
            ${ecuacion}
        </div>
        <div class="equation-display">
            ${ecuacionValores}
        </div>
    `;
    divResultado.classList.add('show');
    
    // Agregar efecto visual a los campos de entrada
    document.querySelectorAll('input[type="text"]').forEach(input => {
        if (input.value) {
            input.classList.add('calculated');
            setTimeout(() => {
                input.classList.remove('calculated');
            }, 600);
        }
    });
});

// ============================================
// INICIALIZACIÓN
// ============================================

// Establecer idioma inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cambiarIdioma('es');
    
    // Agregar validación en tiempo real para inputs numéricos
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Permitir números, punto decimal, signo negativo y backspace
            const valor = e.target.value;
            // Remover cualquier caracter que no sea número, punto o guion al inicio
            const valorLimpio = valor.replace(/[^\d.-]/g, '');
            
            // Asegurar que solo haya un punto decimal
            const partes = valorLimpio.split('.');
            if (partes.length > 2) {
                e.target.value = partes[0] + '.' + partes.slice(1).join('');
            } else {
                e.target.value = valorLimpio;
            }
            
            // Asegurar que el signo negativo solo esté al principio
            if (e.target.value.includes('-')) {
                const negativo = e.target.value[0] === '-';
                const numeroSinSigno = e.target.value.replace(/-/g, '');
                e.target.value = negativo ? '-' + numeroSinSigno : numeroSinSigno;
            }
        });
        
        // Prevenir pegar contenido no numérico
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const texto = (e.clipboardData || window.clipboardData).getData('text');
            const numeroValido = texto.match(/-?\d*\.?\d*/);
            if (numeroValido) {
                document.execCommand('insertText', false, numeroValido[0]);
            }
        });
    });
});