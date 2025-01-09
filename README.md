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

## Manual de usuario


