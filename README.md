# Gerenciador de Transações

![Demonstração do projeto](transactions-with.api.gif)
Este projeto foi desenvolvido para exercitar o uso de requisições a uma API, utilizando a ferramenta `json-server` para simular uma API RESTful a partir de um arquivo JSON.

## 🚀 Funcionalidades
- Adicionar transações financeiras.
- Armazenamento das transações no arquivo `db.json`.
- Exibição das transações na interface.
- Diferenciação visual de transações positivas (verde) e negativas (vermelho).
- Cálculo automático do saldo total baseado nas transações registradas.

## 🛠️ Tecnologias Utilizadas
- **JavaScript**
- **JSON Server** (para simular a API RESTful)
- **HTML e CSS** (para a interface)

## 📦 Como executar o projeto
### 1️⃣ Clonar o repositório
```sh
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2️⃣ Instalar dependências
Se o `json-server` ainda não estiver instalado, instale-o globalmente:
```sh
npm install -g json-server
```

### 3️⃣ Iniciar o servidor JSON
```sh
json-server --watch db.json
```
O servidor será iniciado em `http://localhost:3000`.

### 4️⃣ Abrir o projeto
Basta abrir o arquivo `index.html` no navegador ou rodar um servidor local.

## 📝 Exemplo de Transação
Uma transação salva no `db.json` terá o seguinte formato:
```json
{
  "id": 1,
  "descricao": "Lanche",
  "valor": -30
}
```

---
💡 **Sugestões e melhorias são bem-vindas!** Sinta-se à vontade para contribuir. 😃
