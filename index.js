const getTransactionID = (currentEvent) => {
	return currentEvent.target.closest("section").id.split("-")[1];
};

function formaterAmount(value) {
	const formater = Intl.NumberFormat("pt-br", {
		compactDisplay: "long",
		currency: "BRL",
		style: "currency",
	});

	return formater.format(value);
}

function renderTransactions(transactionData) {
	updateBalance();

	const transaction = document.createElement("section");
	transaction.classList.add("transaction");
	transaction.id = `transaction-${transactionData.id}`;

	const name = document.createElement("h3");
	name.classList.add("transaction-name");
	name.textContent = transactionData.name;

	const transactionValue = document.createElement("span");
	const formatedAmout = formaterAmount(transactionData.value);
	transactionValue.textContent = formatedAmout;

	transactionData.type === "negative" ? transaction.classList.add("negativeCredit") : transaction.classList.add("positiveCredit")

	const editBtn = document.createElement("button");
	editBtn.innerText = "Editar";
	editBtn.addEventListener("click", editTransaction);

	const deleteBtn = document.createElement("button");
	deleteBtn.id = `deleteBtn-${transactionData.id}`;
	deleteBtn.innerText = "Excluir";
	deleteBtn.addEventListener("click", deleteTransaction);

	const buttonsContainer = document.createElement("div");
	buttonsContainer.className = "buttons-container";
	buttonsContainer.append(editBtn, deleteBtn);


	transaction.append(name, transactionValue, buttonsContainer);
	document.querySelector("#transactions").appendChild(transaction);
}

const updateBalance = async () => {
	const totalBalance = document.getElementById("total-balance");
	const actualBalance = await calcBalance();
	const totalBFormated = formaterAmount(actualBalance);
	totalBalance.innerText = totalBFormated;
};

const editTransaction = (ev) => {
	const currentID = getTransactionID(ev);
	const currentTransaction = document.getElementById(`transaction-${currentID}`)
	
	if(currentTransaction.classList.contains("editing")) return
	currentTransaction.classList.add("editing");
	const deleteBtn = document.getElementById(`deleteBtn-${currentID}`);
	const transactionID = getTransactionID(ev);

	const confirmBtn = document.createElement("button");
	confirmBtn.innerText = "Confirmar Edição";

	//Evitar que se crie varios edits containers

	const newName = document.createElement("input");
	newName.placeholder = "Novo Nome";
	newName.id = `inputName-${currentID}`;

	const newValue = document.createElement("input");
	newValue.placeholder = "Novo Valor R$";
	newValue.id = `inputValue-${currentID}`;

	const oldValue = document.querySelector(
		`#transaction-${transactionID} span`
	);
	const oldName = document.querySelector(`#transaction-${transactionID} h3`);


	deleteBtn.replaceWith(confirmBtn);
	oldName.replaceWith(newName);
	oldValue.replaceWith(newValue);

	confirmBtn.addEventListener("click", async () => {
		if (newName.value === "" || newValue === "") {
			return alert("Digite algo no input");
		}
		
		const transactionData = {
			name: newName.value,
			value: newValue.value,
			type: "positive"
		};

		if(newValue.value < 0) {
			transactionData.type = "negative"
		}
		

		await fetch(`http://localhost:3000/transactions/${transactionID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(transactionData),
		});

		const formatedNewValue = formaterAmount(transactionData.value);
		oldName.innerText = newName.value;
		oldValue.innerText = formatedNewValue;
		newName.replaceWith(oldName);
		newValue.replaceWith(oldValue);
		confirmBtn.replaceWith(deleteBtn);
		updateBalance();
		console.log(transactionData.type)
		if(transactionData.type === "negative") {
			currentTransaction.classList.add("negativeCredit")
			currentTransaction.classList.remove("positiveCredit")
		} else {
			currentTransaction.classList.add("positiveCredit")
			currentTransaction.classList.remove("negativeCredit")
		}
		currentTransaction.classList.remove("editing");
	});
};

async function deleteTransaction(ev) {
	const currentID = getTransactionID(ev);
	await fetch(`http://localhost:3000/transactions/${currentID}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	ev.target.closest("section").remove();
	updateBalance();
}

//pegando os dados do backend para mostrar na tela cada transação
async function fetchTransactions() {
	const transaction = await fetch("http://localhost:3000/transactions").then(
		(response) => response.json()
	);
	transaction.forEach(renderTransactions);
}

const calcBalance = async () => {
	const transactions = await fetch("http://localhost:3000/transactions").then(
		(response) => response.json()
	);
	return transactions
		.map((transactionObject) => parseFloat(transactionObject.value))
		.reduce((a, b) => a + b);
};

document.addEventListener("DOMContentLoaded", () => {
	fetchTransactions();
});

const form = document.querySelector("form");
form.addEventListener("submit", async (ev) => {
	ev.preventDefault();

	const nameInput = document.getElementById("name");
	const transValueInput = document.getElementById("transactionValue");

	if (isNaN(transValueInput.value) || nameInput.value === "" || transValueInput.value === "") {
		alert("Erro: Digite apenas números e preencha o formulário");
		return;
	}

	
	
	const transactionData = {
		name: nameInput.value,
		value: transValueInput.value,
		type: "positive"
	};

	if(transValueInput.value < 0) {
		transactionData.type = "negative"
	}
	

	const response = await fetch("http://localhost:3000/transactions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(transactionData),
	});

	const savedTransaction = await response.json();
	form.reset();
	renderTransactions(savedTransaction);
});
