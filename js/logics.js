function insertSymbol(symbol) {
    const textarea = document.getElementById('logicExpression');
    textarea.value += symbol;
    textarea.focus();
}

function validateExpression(expression) {
    const validChars = /^[a-z∧∨¬⊕()\s]*$/i;
    if (!validChars.test(expression)) {
        throw new Error('La expresión contiene caracteres no válidos.');
    }

    const parentheses = expression.split('').reduce((count, char) => {
        if (char === '(') count++;
        if (char === ')') count--;
        if (count < 0) throw new Error('Paréntesis desbalanceados.');
        return count;
    }, 0);

    if (parentheses !== 0) {
        throw new Error('Paréntesis desbalanceados.');
    }
}

function generateTable() {
    const expression = document.getElementById('logicExpression').value.trim();
    if (!expression) {
        alert('Por favor, escribe una proposición lógica.');
        return;
    }

    try {
        validateExpression(expression);
        const variables = Array.from(new Set(expression.match(/[a-z]/gi) || [])).sort();
        const truthTable = generateTruthTable(variables);
        const parsedExpression = parseExpression(expression, variables);
        renderTruthTable(truthTable, parsedExpression);
    } catch (error) {
        alert('Error al procesar la proposición lógica: ' + error.message);
    }
}

function generateTruthTable(variables) {
    const rows = 2 ** variables.length;
    return Array.from({ length: rows }, (_, i) =>
        variables.reduce((row, variable, index) => {
            row[variable] = (i >> (variables.length - 1 - index)) & 1;
            return row;
        }, {})
    );
}

function parseExpression(expression, variables) {
    const symbolMap = {
        '∧': '&&',
        '∨': '||',
        '¬': '!',
        '⊕': '^'
    };

    let jsExpression = expression
        .replace(/[a-z]/gi, (match) => `row['${match}']`)
        .replace(/[∧∨¬⊕]/g, (match) => symbolMap[match]);

    return { 
        expression,
        variables, 
        evaluate: new Function('row', `return ${jsExpression};`) 
    };
}

function renderTruthTable(truthTable, parsedExpression) {
    const { variables, evaluate } = parsedExpression;
    const tableContainer = document.getElementById('truthTable');
    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    variables.forEach(variable => {
        const th = document.createElement('th');
        th.textContent = variable;
        headerRow.appendChild(th);
    });

    const resultHeader = document.createElement('th');
    resultHeader.textContent = 'Salida';
    headerRow.appendChild(resultHeader);
    table.appendChild(headerRow);

    truthTable.forEach(row => {
        const tr = document.createElement('tr');

        variables.forEach(variable => {
            const td = document.createElement('td');
            td.textContent = row[variable];
            tr.appendChild(td);
        });

        const resultCell = document.createElement('td');
        try {
            resultCell.innerHTML = evaluate(row) ? '<span class="highlight-not">1</span>' : '0';
        } catch {
            resultCell.textContent = 'Error';
        }
        tr.appendChild(resultCell);
        table.appendChild(tr);
    });

    tableContainer.appendChild(table);
}

function generateDiagram() {
    const expression = document.getElementById('logicExpression').value.trim();
    if (!expression) {
        alert('Por favor, escribe una proposición lógica.');
        return;
    }

    try {
        validateExpression(expression);
        const variables = Array.from(new Set(expression.match(/[a-z]/gi) || [])).sort();
        const diagramContainer = document.getElementById('diagram');
        diagramContainer.innerHTML = '';
        renderDiagram(expression, variables, diagramContainer);
    } catch (error) {
        alert('Error al procesar la proposición lógica: ' + error.message);
    }
}

function renderDiagram(expression, variables, container) {
const operatorMap = {
'∧': 'AND',
'∨': 'OR',
'¬': 'NOT',
'⊕': 'XOR'
};

const elements = [];
expression.split(/([∧∨¬⊕()])/g).filter(Boolean).forEach(token => {
if (/[a-z]/i.test(token)) {
    elements.push({ type: 'variable', value: token });
} else if (operatorMap[token]) {
    elements.push({ type: 'operator', value: operatorMap[token] });
}
});

const stack = [];
const diagramRows = [];

// Procesamos los elementos de la expresión
elements.forEach((el, index) => {
const row = document.createElement('div');
row.className = 'diagram-section';

// Si el elemento es una variable, lo agregamos
if (el.type === 'variable') {
    const block = document.createElement('div');
    block.className = 'gate';
    block.textContent = el.value;
    row.appendChild(block);
    diagramRows.push(row);
    stack.push(row);
} 
// Si el elemento es un operador, lo procesamos
else if (el.type === 'operator') {
    const block = document.createElement('div');
    block.className = 'gate';
    block.textContent = el.value;
    row.appendChild(block);
    diagramRows.push(row);
    stack.push(row);
}
});

// Conectar los elementos con líneas
diagramRows.forEach((row, index) => {
if (index < diagramRows.length - 1) {
    const connector = document.createElement('div');
    connector.className = 'connector';
    container.appendChild(connector);
}
});

diagramRows.forEach(row => container.appendChild(row));

// Ahora agregamos las conexiones entre operadores y variables
diagramRows.forEach((row, index) => {
if (index < diagramRows.length - 1) {
    const connector = document.createElement('div');
    connector.className = 'horizontal-connector';
    container.appendChild(connector);
}
});
}

async function downloadPDF() {
    const pdf = new jspdf.jsPDF();

    const truthTable = document.getElementById('truthTable');
    const diagram = document.getElementById('diagram');

    const truthTableCanvas = await html2canvas(truthTable);
    const diagramCanvas = await html2canvas(diagram);

    pdf.addImage(truthTableCanvas, 'PNG', 10, 10, 190, 60);
    pdf.addPage();
    pdf.addImage(diagramCanvas, 'PNG', 10, 10, 190, 120);

    pdf.save('circuito-logico.pdf');
}

async function downloadPNG() {
    const container = document.getElementById('container');
    const canvas = await html2canvas(container);
    const link = document.createElement('a');
    link.download = 'circuito-logico.png';
    link.href = canvas.toDataURL();
    link.click();
}

<script src="https://cdn.jsdelivr.net/npm/gojs/release/go-debug.js"></script>