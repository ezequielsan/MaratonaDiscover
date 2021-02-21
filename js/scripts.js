/*      Modal da Rocketseat - Mayki

 const modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close(){
        // fechar o modal
        // remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
} 
*/

/* Desafio - Refatorado */
const Mymodal = {
    // verifica o estado (ativo ou não ativo da classe active)
    toogle() {
        const modal = document.querySelector('.modal-overlay')
        modal.classList.toggle('active')
        //a prop. toogle altera entre true(button nova transação clicado) ou false(button cancelar do modal clicado)    
        Form.clearFields()//limpa os campos no formulario quando e clicado o butão cancelar
    }
}

//Guardando minhas informações(transações) no localStorage
const Storage = {
    get(){
        //pegando meus dados do localStorage
        //só que tenho que tenho que tranforma em array de novo com o JSON.parse()
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        //colocando/setando meus dados(Transactions.all) no localStorage
        //Tenho que transforma meu array em string com o JSON.stringify()
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

//Preciso somar as entradas e saídas e calcular o total (entradas - saídas)
const Transactions = {

    //array de Objetos que contém os dados das minhas transações
    //OBS:. no (500,00) dos amount tiramos a virgula(50000) , futuramente vamos tratar esses zeros a mais
    all: Storage.get(),
    //add novas transações
    add(transaction) {
        Transactions.all.push(transaction)
        App.reload()
        //console.log(Transactions.all) 
    },

    remove(index) {
        Transactions.all.splice(index, 1) //remove a transação do respectivo index passado
        //console.log(Transactions.all)
        App.reload() // recarregando os dados HTML
    },

    incomes() {
        let income = 0
        //pegar todas as transações de entrada
        //para cada transação 
        Transactions.all.forEach(transaction => {
            //desconstruindo o objectsTransactions
            let {
                amount
            } = transaction
            //se ela for maior que zero
            if (amount > 0) {
                //somar a variavel e retornar
                income += amount
            }
        })
        return income
    },

    expenses() {
        let expense = 0
        //pegar todas as transações de saída
        //para cada transação 
        Transactions.all.forEach(transaction => {
            //desconstruindo o objectsTransactions
            const {
                amount
            } = transaction
            //se ela for menor que zero
            if (amount < 0) {
                //somar a variavel e retornar
                expense += amount
            }
        })
        return expense
    },

    total() {
        //entradas - saidas
        //console.log(Transactions.incomes() + Transactions.expenses())
       return Transactions.incomes() + Transactions.expenses()
    }
}

//Inserir dados do JAVASCRIPT no HTML
const DOM = {

    //pega onde esta localizada o campo que iirá receber as objectsTransactions
    transactionContainer: document.querySelector('#data-table tbody'),

    //Adiciona uma nova Transação
    addTransaction(transact, index) {
        const tr = document.createElement('tr') //cria um novo elemento tr
        tr.innerHTML = DOM.innerHTMLTransaction(transact, index) //armazena no tr a estrutura HTML do innerHTMLTransaction da variavel html
        tr.dataset.index = index
        //console.log(tr.innerHTML, tr.dataset.index)

        DOM.transactionContainer.appendChild(tr) // inseri a tr na localização que esta no transactionContainer
    },

    //Adiciona as transações no HTML
    innerHTMLTransaction(transact, index) {
        const {
            description,
            amount,
            date
        } = transact // desconstrui os objectsTransactions, OBS: Refatorei o Código

        const CSSclass = amount > 0 ? 'income' : 'expense' // faz a diferenciação entre saida e entrada de transaçãoes

        const value = Utils.formatCurrency(amount) // value recebe o amount todo formatado e posteriomente inseri na estrutura HTML abaixo

        const html = `
            <td class="description">${description}</td>
            <td class="${CSSclass}">${value}</td>
            <td class="date">${date}</td>
            <td>
                <img src="./assets/minus.svg" onclick="Transactions.remove(${index})" alt="Remover Transação">
            </td>
        `
        return html
    },

    //Inseri no balance os valores de entrada e saída e o saldo
    updateBalance() {
        document.getElementById('incomesDisplay').innerHTML = Utils.formatCurrency(Transactions.incomes())
        document.getElementById('expensesDisplay').innerHTML = Utils.formatCurrency(Transactions.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
    },

    //Limpa as transações parea inserirem novas (usada no reload logo abaixo)
    clearTransactions() {
        DOM.transactionContainer.innerHTML = ''
    },

    //Muda a cor do card total de acordo com o saldo
    styleCardTotal() {
        var signalAmount = Transactions.total()

        if (signalAmount < 0) {
            document.querySelector('.card.total').style.backgroundColor = 'var(--red)';
        } else {
            document.querySelector('.card.total').style.backgroundColor = 'var(--green)';
        }
    }
}

//Aqui vou Formatar minha moeda(amount)
const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "" // pega o sinal dos amounts

        value = String(value).replace(/\D/g, "") //remove tudo que não for número

        value = Number(value) / 100 // trata os zeros a mais

        value = value.toLocaleString("pt-br", { //add o cifrão
            style: 'currency',
            currency: 'BRL'
        })
        return `${signal} ${value}` //retorna o amount formatado
    },

    formatAmount(value) {
        
        value = String(value.replace(",", ".")) * 100
        //console.log(value)

        return value
        //OBS:. O sistema não aceita valores abaixo de 0,01
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    // verificar se todas as informações foram preenchidas
    validateFields() {
        const {
            description,
            amount,
            date
        } = Form.getValues() //desconstruindo o objeto de retorno do getvalues

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") { //verificando se a campos vazios
            throw new Error("Por favor, preencha todos os campos")
        }
        // console.log(description, amount, date)
    },

    // formatando os valores dos campos
    formatValues() {
        let { description, amount, date } = Form.getValues() //pegando e desconstruindo

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        

        //console.log(description, amount, date)
        return {
            description,
            amount,
            date
        }
    },
    /* saveTransactions() {
        const transac = Form.formatValues()

        Transactions.add(transac)
    }, */

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },

    //Salvando os valores no JS


    submit(event) {
        event.preventDefault() // removendo comportamento padrão do butão salvar

        try { // tratando possíveis erros

            Form.validateFields() //validando dados

            const v = Form.formatValues() // formatar os dados par salvar

           Transactions.add(v)// salvar
            Form.clearFields()// apagar dados do formulário
            Mymodal.toogle()// fechar modal
            // atualizar a aplicação
        } catch (error) {
            alert(error.message)
        }


    }
}

//Iniciar a execução do código e fazer o reloud
const App = {
    init() {
        //seta as propriedaedes do card total
        DOM.styleCardTotal()

        //mapeia cada elemento do objectsTransactions e joga os dados no addTransaction para inserir no HTML
        Transactions.all.forEach((transactionAtual, index) => DOM.addTransaction(transactionAtual, index)) //Refatorada : Transactions.all.forEach(DOM.addTransaction)

        //invocando a prop. que inseri os valores de entrda e saida no card HTML
        DOM.updateBalance()

        Storage.set(Transactions.all)
    },

    reload() {
        //limpo as transações
        DOM.clearTransactions()

        //Inicializo de novo a execução do app
        App.init()
    }
}

App.init()

/* Scroll Button to Top */
const btn = document.getElementById("btn-scroll")

const scr = {
    //Primeiro eu preciso esconder ou fazer aparecer o butão caso haja a rolagem na página
    buttonVisible() {
        if(document.documentElement.scrollTop > 100) {
            btn.style.display = "block";
        }else {
            btn.style.display = "none";
        } 
    },
    //Quando clicar no butão preciso que volte role até o topo
    backToTop() {
        document.documentElement.scrollTop = 0
    }
}

//Chamando a função buttonVisible quando tiver rolagem na página
window.onscroll = function() {
    scr.buttonVisible();
}

//aplicar quando clica fora do modal fecha o modal
//aplicar modo dark
const html = document.querySelector('html');
const checkbox = document.querySelector('input[name=theme]');

const getStyle = (element, style) => {
    return window.getComputedStyle(element).getPropertyValue(style)
}
    
const initialColors = {
    bg: getStyle(html, "--bg"),
    bgTable: getStyle(html, "--bg-table"),
    bgCard: getStyle(html, "--bg-card"),
    bgCardTotal: getStyle(html, "--bg-card-total"),
    colorTextTotal: getStyle(html, "--color-text-total"),
    colorText: getStyle(html, "--color-text"),   
    bgHeader: getStyle(html, "--bg-header"),   
    green: getStyle(html, "--green"),   
    greenLight: getStyle(html, "--green-light"),   
    red: getStyle(html, "--red"),   
}

const darkMode = {
    bg: "#121214",
    bgTable: "#434343",
    bgCard: "#202024",
    bgCardTotal: "#04D361",
    colorTextTotal: "#E1E1E6",
    colorText: "#E1E1E6",
    bgHeader: "#9466FF",
    green: "#04D361",
    greenLight: "#ffff3f",
    red: "#ce2f06"
}

const transformKey = key => "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()

const changeColors = colors => {
    // console.log(colors)
    Object.keys(colors).map(key => {
        html.style.setProperty(transformKey(key), colors[key])
    })

}

checkbox.addEventListener('change', ({target}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors);

})