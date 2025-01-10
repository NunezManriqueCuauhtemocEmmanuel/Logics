![icon](https://github.com/user-attachments/assets/8893bd57-933e-44e2-ad9a-494cef627ddd)
# LogicS
<p>
  Bienvenidos al repositorio oficial de LogicS, LogicS es una aplicación web dedicada a la simulacion de conectores 
</p>

## Teoria

<p> Aqui prensentamos una introducción teorica a el contexto de LogicS </p>

### ¿Qué Manejamos?

<p>
  Circuitos logicis, un circuito logico es una estructura que sigue las leyes de la lógica y se utiliza para representar proposiciones complejas mediante el uso de señales eléctricas. Básicamente, es un circuito que maneja información en forma de “1” y “0”, donde “1” 
  representa un nivel alto de voltaje y “0” un nivel bajo. Estos niveles lógicos son fundamentales para el funcionamiento de cualquier dispositivo electrónico.
</p>

### Tipos de circuitos Logicos

<p>
  Existen varios tipos de circuitos lógicos, cada uno con su propia funcionalidad y aplicación. A continuación, te presentamos los más comunes:
</p>

<ul>
  <li>Circuitos lógicos combinacionales</li>
  <li>Circuitos lógicos secuenciales</li>
</ul>

![image](https://github.com/user-attachments/assets/fcff733c-540a-4f6e-8741-413010cb8d36)

### Circuitos lógicos combinacionales

<p>
  Los circuitos lógicos combinacionales son aquellos en los que la salida depende únicamente de las entradas actuales. No tienen memoria, por lo que su estado no depende de entradas anteriores. 
</p>

### Circuitos lógicos secuenciales

<p>
  A diferencia de los combinacionales, los circuitos lógicos secuenciales tienen memoria y su salida depende de las entradas actuales y del estado anterior
</p>

## Construcción de LogicS

### Lenguajes

<p>
  LogicS fue maquetado en HTML y sus estilos definidos por CSS, mientras que la programación logica del programa se encuentra en JS com ayuda de la libreria GOJS que tiene como finalidad generar los diagramas de forma correcta.
</p>

### Funciones principales

<p>Generador de Diagrama</p>

<pre>
  function buildDiagramData(node, parentKey = null, diagramData = []) {
    if (parentKey) {
      diagramData.push({ from: node.key, to: parentKey }); // Cambiar "from" y "to"
    }
  
    if (!diagramData.some(d => d.key === node.key)) {
      diagramData.push({ key: node.key, category: node.category });
    }
  
    node.children.forEach(child => buildDiagramData(child, node.key, diagramData));
    return diagramData;
  }
</pre>

<p>Simulador de salidas</p>

<pre>
  function generateTruthTable() {
    const expression = document.getElementById("expression").value;
  
    // Normaliza la expresión
    const normalizedExpression = expression
      .replace(/¬/g, 'NOT')
      .replace(/∧/g, 'AND')
      .replace(/∨/g, 'OR')
      .replace(/\b[a-zA-Z]\b/g, match => match.toUpperCase());
  
    const variables = Array.from(new Set(normalizedExpression.match(/\b[A-Z]\b/g)));
  
    if (variables.length === 0) {
      alert("No se encontraron variables en la expresión. Por favor, verifica la entrada.");
      return;
    }
  
    const table = document.createElement("table");
    const header = document.createElement("tr");
  
    // Genera los encabezados
    variables.forEach(v => {
      const th = document.createElement("th");
      th.textContent = v;
      header.appendChild(th);
    });
  
    const resultHeader = document.createElement("th");
    resultHeader.textContent = "Salida";
    header.appendChild(resultHeader);
    table.appendChild(header);
  
    // Genera las filas
    const rows = 2 ** variables.length;
    for (let i = 0; i < rows; i++) {
      const row = document.createElement("tr");
      const values = variables.map((v, index) => ((i >> (variables.length - index - 1)) & 1) === 1);
  
      values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value ? "1" : "0";
        row.appendChild(cell);
      });
  
      const resultCell = document.createElement("td");
      const evaluatedExpression = normalizedExpression
        .replace(/\b[A-Z]\b/g, match => values[variables.indexOf(match)] ? "true" : "false")
        .replace(/AND|&/g, "&&")
        .replace(/OR|\|/g, "||")
        .replace(/NOT|!/g, "!");
      try {
        resultCell.textContent = eval(evaluatedExpression) ? "1" : "0";
      } catch (error) {
        resultCell.textContent = "Error";
        console.error("Error al evaluar la expresión:", error);
      }
      row.appendChild(resultCell);
  
      table.appendChild(row);
    }
  
    // Muestra la tabla
    const truthTableDiv = document.getElementById("truthTableDiv");
    truthTableDiv.innerHTML = ""; // Limpia cualquier tabla previa
    truthTableDiv.appendChild(table);
  }
</pre>

### Pruebas 

<p> Errores cononcidos </p>

<ul>
  <li>
    El circulo de navegación aveces se pone por debajo de secciones
  </li>
  <li>
    No se carga correctamente la seccion de simulacion de salida en caso de usar un .csv
  </li>
</ul>

<p> En esta aplicacion se cuenta con validacion de datos, en el siguiente cuadro de texto se muestra la funcion de validacion</p>

<pre>
  function validateExpressionInput(event) {
    const allowedCharacters = /^[A-Za-z¬∧∨() ]*$/; // Letras, símbolos permitidos y paréntesis
    const input = event.target.value;
  
    // Validar que todas las variables sean de una sola letra
    const variables = input.match(/[A-Za-z]/g);
    if (variables && variables.some(variable => variable.length > 1)) {
      alert("Solo se permiten variables de una sola letra.");
      event.target.value = input.replace(/[A-Za-z]+/g, match => match.length > 1 ? "" : match);
      return;
    }
  
    // Validar caracteres no permitidos
    if (!allowedCharacters.test(input)) {
      event.target.value = input.replace(/[^A-Za-z¬∧∨() ]/g, '');
      alert("Solo se permiten letras, los símbolos ¬∧∨ y los paréntesis.");
    }
  }
</pre>

## Manual de usuario

<p> Para facilitar el uso de LogicS, presentamos el siguiente manual</p>

### Actores

<p> En logics unicamente existe el actor "usuario", este es el encargado de manejar todo el sistema LogicS </p>

### Uso de expresiones

<p> 
  LogicS ha sido creado para fabricar circuitos logicos con base en expresiones logicas, sin embargo, como podemos asegurar que la aplicación tendra 
  el resultado obtenido; para esto sigue las instrucciones de construccón de expresiones que se presentan a continuación.
</p>

<ul>
  <li>
    Variables
  </li>
  <li>
    Uso de simbolos logicos
  </li>
  <li>
    Uso de palabras como conector
  </li>
  <li>
    Parentesis
  </li>
  <li>
    CSV
  </li>
</ul>

### Variables

<p>
  Las variables en el simulador, unicamente pueden ser escritas con letras, la construccion del diagrama no dependera de la longitud de la variable sin embargo, la generación de un resultado simulado y de la tabla de verdad será fallida lanzando un mensaje de error por 
  lo que unicamente se deben usar variables de 1 caracter de longitud si se desea obtener todas las funciones de LogicS.
</p>

### Uso de simbolos logicos

<p>
  El uso de simbolos logicos es compatible en la caja de texto, el simulador funcionara correctamente si se colocan los simbolos ∨, ∧, ¬ ;cabe resaltar que para el uso de "¬", este simbolo se debe colocar antes de la variable, por ejemplo "¬A". Los simbolos se pueden 
  colocar para mayor facilidad de los usuarios con los botones de ayuda debajo de la caja de texto.
</p>

### Uso de palabras como conector

<p>
  El uso de palabras como conector logico es compatible en la caja de texto, el simulador funcionará correctamente si se colocan las pablabras AND, OR Y NOT, tomando en cuanta que al igual que con el simbolo not, la palabra debe colocarse atras de la variable, por 
  ejemplo "NOT A"
</p>

### Parentesis

<p>
  El simulador actuará depende a la jerarquia de operadores dentro de la expresion, es decir, se respetará el uso de parentesis dentro de la caja de texto, por ejemplo "(A AND B) OR (A AND C)" ó "(A ∧ B) ∨ (A ∧ C)".
</p>

### CSV

<p>
  Para el uso del archivo CSV, las anteriores instrucciones deben seguirse tal cual, la expresión debe estar escrita en la columna "A" del editor de textos de preferencia; Importante, solo se aceptan datos en esa columna, asi como unicamente archivos csv.
</p>

### Simulador

<p>
  El simulador LogicS cuenta con tres funciones principales
</p>

<ul>
  <li>
    Creador de diagramas 
  </li>
  <li>
    Simulador de Salida
  </li>
  <li>
    Tabla de verdad
  </li>
</ul>

### Creador de diagramas

<p>
  El diagrama aparecerá siempre y cuando la expresión este correctamente escrita segun las instrucciones anteriores; las compuertas pertenecientes a la expresion logica se podran acomodar a gusto del usuario, sin embrago apareceran con un orden predeterminado iniciando 
  de izquierda a derecha por las variables y cerrando con una salida, este diagrama se puede descargar en png y pdf.
</p>

### Simulador de Salida

<p>
  El simulador de salida se utiliza para obtener la salida de valores especificos de las variables de una expresión, debajo del creador de diagramas, apareceran las variables y una caja para definir su valor, cierto o falso (1 ó 0).
</p>

### Tabla de verdad

<p>
  Esta se generará siempre y cuando la expresion haya sido escrita correctamente, se creara una tabla de verdad que mostrara todas sus salidas y combinaciones de valores para las variables, esta tabla se podra descargar en formato pdf y csv.
</p>


<hr>

## Conocenos

<p>
  Este trabajo fue creado por Nuñez Manrique Cuauhtemoc Emmanuel, todo el diseño, idea y nombre de LogicS pertenecen al creador, puedes encontrar este y  más proyectos en el repositorio de Github del creador
</p>

_Derechos reservados de MGMC | 2025_

