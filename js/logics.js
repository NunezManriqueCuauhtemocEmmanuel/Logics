const $ = go.GraphObject.make;
const myDiagram = $(go.Diagram, "diagramDiv", {
  "undoManager.isEnabled": true,
  layout: $(go.TreeLayout, { angle: 0, layerSpacing: 35 })
});



myDiagram.nodeTemplateMap.add("AND",
    $(go.Node, "Spot",
      { angle: 0 }, // Ángulo inicial (puedes ajustarlo a 90, 180, etc. para rotar)
      $(go.Panel, "Auto",
        $(go.Shape, {
          geometryString: "F M0 0 L0 50 L30 50 L30 0 L0 0 M30 0 A20 20 0 0 1 30 50", // Forma clásica de la compuerta AND
          fill: "#11588c ", // Color de fondo
          stroke: "#11588c ", // Color del borde
          strokeWidth: 4
        }),
        $(go.TextBlock, {
          margin: 8,
          font: "12px sans-serif",
          stroke: "white"
        }, new go.Binding("text", "key"))
      )
    )
);

myDiagram.nodeTemplateMap.add("OR",
  $(go.Node, "Auto",
    $(go.Shape, "Rectangle", { fill: "#167d23", stroke:"#167d23", strokeWidth: 4 }),
    $(go.TextBlock, { margin: 8, font: "12px 'Hammersmith One', serif", stroke:"white" }, new go.Binding("text", "key"))
  )
);

myDiagram.nodeTemplateMap.add("NOT",
  $(go.Node, "Spot",
    $(go.Shape, "Triangle", {fill: "#7d2424",stroke: "#7d2424",desiredSize: new go.Size(70, 70), angle: 90}),
    $(go.TextBlock, {margin: 0, stroke:"white" ,font: "12px 'Hammersmith One', serif", textAlign: "center",verticalAlignment: go.Spot.Center, alignment: go.Spot.Center },
      new go.Binding("text", "key"))
  )
);


myDiagram.nodeTemplateMap.add("SALIDA",
  $(go.Node, "Auto",
    $(go.Shape, "Circle", {fill:"#a77e19", stroke: "#a77e19 ", strokeWidth: 4, desiredSize: new go.Size(50, 50)}),
    $(go.TextBlock, { margin: 8, font: "10px 'Hammersmith One', serif", stroke:"#ffffff" }, new go.Binding("text", "key"))
  )
);

function parseExpression(expr) {
  // Mapear símbolos a operadores lógicos
  expr = expr
    .replace(/¬/g, 'NOT')
    .replace(/∧/g, 'AND')
    .replace(/∨/g, 'OR');

  // Convertir todo a mayúsculas para unificar las variables
  expr = expr.replace(/\b[a-zA-Z]\b/g, match => match.toUpperCase());

  const operators = {
    OR: 1, '|': 1,
    AND: 2, '&': 2,
    NOT: 4, '!': 4,
  };

  const isOperator = (token) => token in operators;
  const precedence = (op) => operators[op];

  const outputQueue = [];
  const operatorStack = [];

  const tokens = expr.match(/\w+|\(|\)|AND|OR|NOT|XOR|NAND|NOR|[&|^!]/g);

  tokens.forEach((token) => {
    if (isOperator(token)) {
      while (
        operatorStack.length > 0 &&
        precedence(operatorStack[operatorStack.length - 1]) >= precedence(token) &&
        operatorStack[operatorStack.length - 1] !== '('
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop();
    } else {
      outputQueue.push(token);
    }
  });

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
}

function buildTree(queue) {
    const stack = [];
    queue.forEach((token) => {
      if (isOperator(token)) {
        const node = { key: token, category: token, children: [] };
        if (token === 'NOT' || token === '!') {
          node.children.push(stack.pop());
        } else {
          const right = stack.pop();
          const left = stack.pop();
          node.children.push(left, right);
        }
        stack.push(node);
      } else {
        stack.push({ key: token, category: "", children: [] });
      }
    });
    const root = stack[0];
    const outputNode = { key: "SALIDA", category: "SALIDA", children: [root] };
    return outputNode;
  }

  return buildTree(outputQueue);
}

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

let uniqueNodeCounter = 1;
function ensureUniqueKeys(node) {
  if (node.children && node.children.length > 0) {
    node.children.forEach(ensureUniqueKeys);
  }
  if (['AND', 'OR', 'NOT'].includes(node.key)) {
    node.key = `${node.key}_${uniqueNodeCounter++}`;
  }
}

function generateDiagram() {
  const input = document.getElementById("expression");
  let expression = input.value;

  // Normaliza la expresión
  expression = normalizeExpression(expression);
  input.value = expression;
  

  if (!expression) {
    alert("Por favor, ingresa una expresión lógica.");
    return;
  }

  const tree = parseExpression(expression);
  ensureUniqueKeys(tree);
  const diagramData = buildDiagramData(tree);

  myDiagram.model = new go.GraphLinksModel(
    diagramData.filter(d => d.key).map(d => ({ key: d.key, category: d.category })),
    diagramData.filter(d => d.from && d.to)
  );

}

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
  


function downloadAsPNG() {
  const canvas = myDiagram.makeImageData({ background: "white" });
  const link = document.createElement("a");
  link.href = canvas;
  link.download = "diagram.png";
  link.click();
}

function downloadAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const canvas = myDiagram.makeImageData({ background: "white" });

  const image = new Image();
  image.src = canvas;

  image.onload = function () {
    doc.addImage(image, "PNG", 10, 10, 190, 100);

    const truthTableDiv = document.getElementById("truthTableDiv");
    if (truthTableDiv) {
      const rows = truthTableDiv.querySelectorAll("tr");
      let y = 120;

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td, th");
        let x = 10;
        cells.forEach(cell => {
          doc.text(cell.textContent, x, y);
          x += 30;
        });
        y += 10;
      });
    }

    doc.save("diagram_and_table.pdf");
  };
}

function insertSymbol(symbol) {
  const input = document.getElementById("expression");
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const text = input.value;

  // Inserta el símbolo en la posición del cursor
  input.value = text.substring(0, start) + symbol + text.substring(end);

  // Normaliza la expresión
  input.value = normalizeExpression(input.value);

  // Coloca el cursor al final del texto
  input.selectionStart = input.selectionEnd = input.value.length;

  // Mantén el foco en el campo de texto
  input.focus();
}

function normalizeExpression(expression) {
  return expression
    .replace(/([A-Za-z])([¬∧∨()])/g, "$1 $2") // Añadir espacio entre variable y operador o paréntesis
    .replace(/([¬∧∨()])([A-Za-z])/g, "$1 $2") // Añadir espacio entre operador o paréntesis y variable
    .replace(/([¬∧∨()])([¬∧∨()])/g, "$1 $2") // Añadir espacio entre operadores o paréntesis consecutivos
    .replace(/\s+/g, " ") // Reemplazar múltiples espacios por uno solo
    .trim(); // Eliminar espacios iniciales y finales
}

function createVariableInputs(variables) {
    const container = document.getElementById("variableInputs");
    container.innerHTML = ""; // Limpia los inputs previos
  
    variables.forEach(variable => {
      const label = document.createElement("label");
      label.textContent = `${variable}: `;
      label.style.fontFamily = "'Hammersmith one',serif"
      label.style.margin = "10px";
      label.style.fontWeight = "bold"; // Estilo adicional para el label
      label.style.color = "#333"; // Cambia el color del texto del label
      label.style.fontSize = "14px"; // Ajusta el tamaño de la fuente
      label.style.display = "inline-block"; // Asegura que el label se quede en una línea con el select
    
      const select = document.createElement("select");
      select.id = `var_${variable}`;
      select.style.marginRight = "20px";
      select.style.border = "none";
      select.style.borderRadius = "10px";
      select.style.width = "40px";
      select.style.height = "40px";
      select.style.textAlign = "center";
      select.style.background = "#131835";
      select.style.color = "white";
      select.style.boxShadow = "0px 0px 7px rgba(0, 0, 0, 0.7)";
    
      const option0 = document.createElement("option");
      option0.value = "0";
      option0.textContent = "0";
      select.appendChild(option0);
    
      const option1 = document.createElement("option");
      option1.value = "1";
      option1.textContent = "1";
      select.appendChild(option1);
    
      container.appendChild(label);
      container.appendChild(select);
    });
  }
  
  function calculateOutput() {
    const expression = document.getElementById("expression").value;
  
    // Asegúrate de que las variables y expresión estén en mayúsculas
    const normalizedExpression = expression
      .replace(/¬/g, 'NOT')
      .replace(/∧/g, 'AND')
      .replace(/∨/g, 'OR')
      .replace(/\b[a-zA-Z]\b/g, match => match.toUpperCase());
  
    const variables = Array.from(new Set(normalizedExpression.match(/\b[A-Z]\b/g)));
    const values = {};
  
    // Obtén los valores de las variables
    variables.forEach(variable => {
      const select = document.getElementById(`var_${variable}`);
      values[variable] = select ? parseInt(select.value) : 0;
    });
  
    // Reemplaza las variables en la expresión con sus valores
    let evaluatedExpression = normalizedExpression.replace(/\b[A-Z]\b/g, match => values[match] ? "true" : "false");
  
    // Convierte los operadores lógicos a equivalentes de JavaScript
    evaluatedExpression = evaluatedExpression
      .replace(/AND|&/g, "&&")
      .replace(/OR|\|/g, "||")
      .replace(/NOT|!/g, "!");
  
    try {
      // Evalúa la expresión
      const result = eval(evaluatedExpression) ? 1 : 0;
      document.getElementById("outputValue").textContent = result;
    } catch (error) {
      document.getElementById("outputValue").textContent = "Error";
      console.error("Error al evaluar la expresión:", error);
    }
  }
  
  // Generar dinámicamente los inputs para las variables al cargar la expresión
  document.getElementById("expression").addEventListener("change", () => {
    const expression = document.getElementById("expression").value;
    const variables = Array.from(new Set(expression.match(/\b[A-Za-z]\b/g))).map(v => v.toUpperCase());
    createVariableInputs(variables);
  });
  
  function validateExpressionInput(event) {
    const allowedCharacters = /^[A-Za-z¬∧∨() ]*$/; // Letras, símbolos permitidos y paréntesis
    const input = event.target.value;
  
    // Elimina cualquier carácter no permitido
    if (!allowedCharacters.test(input)) {
      event.target.value = input.replace(/[^A-Za-z¬∧∨() ]/g, '');
      alert("Solo se permiten letras, los símbolos ¬∧∨ y los paréntesis.");
    }
  }
  

  function loadCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').map(line => line.trim());
        const select = document.getElementById('expressionSelect');
        select.innerHTML = '<option value="">--Selecciona una expresión--</option>';

        lines.forEach((line, index) => {
            if (line) {
                const option = document.createElement('option');
                option.value = line;
                option.textContent = `Expresión ${index + 1}: ${line}`;
                select.appendChild(option);
            }
        });
    };
    reader.readAsText(file);
}

function setExpression() {
    const select = document.getElementById('expressionSelect');
    const input = document.getElementById('expression');
    input.value = select.value;
}

function insertSymbol(symbol) {
    const input = document.getElementById('expression');
    input.value += symbol;
}

function downloadTruthTableAsCSV() {
  const truthTableDiv = document.getElementById("truthTableDiv");
  if (!truthTableDiv || truthTableDiv.children.length === 0) {
      alert("No hay tabla de verdad generada para descargar.");
      return;
  }

  const rows = truthTableDiv.querySelectorAll("tr");
  const csvContent = Array.from(rows)
      .map(row => {
          const cells = row.querySelectorAll("td, th");
          return Array.from(cells).map(cell => cell.textContent).join(",");
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "LogicS_Tabla_De_Verdad.csv";
  link.click();
}

