// Función para obtener el tipo de tirada seleccionada (normal, ventaja, desventaja)
function getRollType() {
    return document.querySelector('input[name="roll-type"]:checked').value;
  }
  
  // Función auxiliar para generar un número aleatorio entre 1 y el número de caras del dado
  function getRandomNumber(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }
  
  // Función para lanzar un dado con un número específico de caras, con ventaja o desventaja si aplica
  function rollDiceWithSides(sides) {
    const rollType = getRollType();
    let result;
  
    if (rollType === "normal") {
      result = getRandomNumber(sides);
      displayResult(`D${sides}`, [result], result, rollType);
    } else {
      const roll1 = getRandomNumber(sides);
      const roll2 = getRandomNumber(sides);
      result = rollType === "advantage" ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
      displayResult(`D${sides}`, [[roll1, roll2]], result, rollType);
    }
  }
  
  // Función para interpretar la expresión personalizada y lanzar los dados
  function rollCustomDice() {
    const expression = document.getElementById("dice-expression").value.trim();
    const regex = /^(\d*)d(\d+)([+-]\d+)?$/;
    const match = expression.match(regex);
  
    if (!match) {
      alert("Por favor, introduce una expresión válida. Ejemplo: 2d6+3");
      return;
    }
  
    const numDice = parseInt(match[1] || "1");
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || "0");
    const rollType = getRollType();
  
    const { total, rolls } = rollDice(numDice, sides, rollType);
    displayResult(expression, rolls, total + modifier, rollType);
  }
  
  // Función para ejecutar tiradas de dados basadas en el tipo y cantidad
  function rollDice(numDice, sides, rollType) {
    let total = 0;
    const rolls = [];
  
    for (let i = 0; i < numDice; i++) {
      const roll1 = getRandomNumber(sides);
      const roll2 = rollType !== "normal" ? getRandomNumber(sides) : null;
  
      let selectedRoll = rollType === "normal" ? roll1 : (rollType === "advantage" ? Math.max(roll1, roll2) : Math.min(roll1, roll2));
      rolls.push(rollType === "normal" ? roll1 : [roll1, roll2]);
      total += selectedRoll;
    }
    
    return { total, rolls };
  }
  
  // Función para mostrar el resultado en pantalla y añadirlo al historial
  function displayResult(expression, rolls, total, rollType) {
    const resultElement = document.getElementById("result");
    const diceResultElement = document.getElementById("dice-result");
  
    diceResultElement.textContent = rollType === "normal" ? rolls.join(", ") : rolls.map(([r1, r2]) => `${r1}, ${r2}`).join(" | ");
    resultElement.innerHTML = `Resultado de ${expression}: <span class="${rollType === "advantage" ? "highlight" : "disadvantage-highlight"}">${total}</span>`;
  
    addToHistory(expression, rolls, total, rollType);
  }
  
  // Función para agregar una entrada al historial
  function addToHistory(expression, rolls, total, rollType) {
    const historyList = document.getElementById("history-list");
    const listItem = document.createElement("li");
    
    const rollsText = rollType === "normal" ? `[${rolls.join(", ")}]` : rolls.map(([r1, r2]) => `[${r1}, ${r2}]`).join(" | ");
    listItem.innerHTML = `${expression} ➔ ${rollsText} = <span class="${rollType === "advantage" ? "highlight" : "disadvantage-highlight"}">${total}</span>`;
    
    historyList.appendChild(listItem);
  }
  
  // Función para añadir una función personalizada como botón
  function addCustomFunction() {
    const name = document.getElementById('custom-function-name').value.trim();
    const expression = document.getElementById('custom-function-expression').value.trim();
  
    if (!name || !expression) {
      alert("Por favor, ingrese un nombre y una expresión válida.");
      return;
    }
  
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'custom-button-container';
  
    const button = document.createElement('button');
    button.textContent = name;
    button.dataset.expression = expression;
    button.onclick = () => rollCustomExpression(button.dataset.expression);
  
    const editIcon = createEditIcon(button);
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(editIcon);
    
    document.getElementById('custom-buttons-container').appendChild(buttonContainer);
    clearCustomFunctionInputs();
  }
  
  // Crea un ícono de edición para un botón
  function createEditIcon(button) {
    const editIcon = document.createElement('span');
    editIcon.textContent = '✎';
    editIcon.className = 'edit-icon';
    editIcon.onclick = () => openEditModal(button);
    return editIcon;
  }
  
  // Limpiar campos de entrada de funciones personalizadas
  function clearCustomFunctionInputs() {
    document.getElementById('custom-function-name').value = '';
    document.getElementById('custom-function-expression').value = '';
  }
  
  // Función para abrir el modal de edición y prellenar los campos
  let editingButton = null;  // Variable para almacenar el botón en edición
  function openEditModal(button) {
    editingButton = button;
    document.getElementById('edit-function-name').value = button.textContent;
    document.getElementById('edit-function-expression').value = button.dataset.expression;
    document.getElementById('edit-modal').style.display = 'flex';
  }
  
  // Función para cerrar el modal de edición
  function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    editingButton = null;
  }
  
  // Función para guardar los cambios en el botón en edición
  function saveEdit() {
    if (!editingButton) return;
  
    const newName = document.getElementById('edit-function-name').value.trim();
    const newExpression = document.getElementById('edit-function-expression').value.trim();
  
    if (!newName || !newExpression) {
      alert("Por favor, ingrese un nombre y una expresión válida.");
      return;
    }
  
    editingButton.textContent = newName;
    editingButton.dataset.expression = newExpression;
  
    closeEditModal();
  }
  
  // Función para ejecutar la expresión personalizada de un botón
  function rollCustomExpression(expression) {
    const regex = /^(\d*)d(\d+)([+-]\d+)?$/;
    const match = expression.match(regex);
  
    if (!match) {
      alert("La expresión personalizada no es válida. Ejemplo de expresión válida: 1d20+3");
      return;
    }
  
    const numDice = parseInt(match[1] || "1");
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || "0");
    const rollType = getRollType();
  
    const { total, rolls } = rollDice(numDice, sides, rollType);
    displayResult(expression, rolls, total + modifier, rollType);
  }
  