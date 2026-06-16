import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsoi-us9x6va-QTygJVWIXi9k_nLta8Ls",
    authDomain: "kanban-brmobility.firebaseapp.com",
    databaseURL: "https://kanban-brmobility-tecnica-default-rtdb.firebaseio.com",
    projectId: "kanban-brmobility",
    storageBucket: "kanban-brmobility.firebasestorage.app",
    messagingSenderId: "792111549567",
    appId: "1:792111549567:web:571f171f254a89a92c834a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tabela = document.getElementById("tabelaVeiculos");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnRelatorio = document.getElementById("btnRelatorio");

const modelo = document.getElementById("modelo");
const patrimonio = document.getElementById("patrimonio");
const status = document.getElementById("status");

const txtRelatorio = document.getElementById("textoRelatorio");

const totalVeiculos = document.getElementById("totalVeiculos");
const totalProducao = document.getElementById("totalProducao");
const totalTeste = document.getElementById("totalTeste");
const totalStandby = document.getElementById("totalStandby");

let veiculos = [];

function atualizarDashboard() {

    totalVeiculos.textContent =
        veiculos.length;

    totalProducao.textContent =
        veiculos.filter(v =>
            v.status === "Em Produção"
        ).length;

    totalTeste.textContent =
        veiculos.filter(v =>
            v.status === "Em Teste"
        ).length;

    totalStandby.textContent =
        veiculos.filter(v =>
            v.status === "Stand By"
        ).length;
}

function renderizarTabela() {

    tabela.innerHTML = "";

    veiculos.forEach(v => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${v.modelo}</td>
            <td>${v.patrimonio}</td>
            <td>${v.status}</td>
            <td>${v.data}</td>
            <td>
                <button class="btnExcluir"
                onclick="excluirVeiculo('${v.id}')">
                Excluir
                </button>
            </td>
        `;

        tabela.appendChild(tr);
    });

    atualizarDashboard();
}

window.excluirVeiculo = async function(id){

    if(!confirm("Deseja excluir este veículo?"))
        return;

    await remove(
        ref(db, "veiculos/" + id)
    );
}

async function adicionarVeiculo(){

    if(
        !modelo.value ||
        !patrimonio.value ||
        !status.value
    ){
        alert("Preencha todos os campos.");
        return;
    }

    const dataAtual =
        new Date().toLocaleString("pt-BR");

    await push(
        ref(db, "veiculos"),
        {
            modelo: modelo.value,
            patrimonio: patrimonio.value,
            status: status.value,
            data: dataAtual
        }
    );

    modelo.value = "";
    patrimonio.value = "";
    status.value = "";
}

function gerarRelatorio(){

    const hoje =
        new Date().toLocaleDateString("pt-BR");

    let texto = `Olá, senhores(as).

Segue atualização de produção de veículos do Departamento Técnico Eletromecânico.

`;

    veiculos.forEach(v => {

        texto += `${v.modelo} - ${v.patrimonio} - ${v.status}\n`;

    });

    texto += `

A lista foi atualizada no dia ${hoje} pelo Líder Técnico Matheus Machado em conjunto com os Técnicos Aran Monteiro, Brandon David e Maxwel Gatti.

Obrigado.
`;

    txtRelatorio.value = texto;

    navigator.clipboard.writeText(texto);

    alert("Relatório copiado para a área de transferência.");
}

onValue(
    ref(db, "veiculos"),
    (snapshot) => {

        veiculos = [];

        if(snapshot.exists()){

            const dados = snapshot.val();

            Object.keys(dados).forEach(id => {

                veiculos.push({
                    id,
                    ...dados[id]
                });

            });
        }

        renderizarTabela();
    }
);

btnAdicionar.addEventListener(
    "click",
    adicionarVeiculo
);

btnRelatorio.addEventListener(
    "click",
    gerarRelatorio
);
