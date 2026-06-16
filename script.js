import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const db = window.db;

let veiculos = [];

async function carregarVeiculos() {

    tabela.innerHTML = "";
    veiculos = [];

    const querySnapshot = await getDocs(
        collection(db, "veiculos")
    );

    querySnapshot.forEach((documento) => {

        const dados = documento.data();

        veiculos.push({
            id: documento.id,
            ...dados
        });

    });

    renderizarTabela();
    atualizarDashboard();
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
                <button
                    class="btnExcluir"
                    onclick="excluirVeiculo('${v.id}')">
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(tr);

    });

}

async function adicionarVeiculo() {

    if(
        modelo.value === "" ||
        patrimonio.value === "" ||
        status.value === ""
    ){
        alert("Preencha todos os campos.");
        return;
    }

    const dataAtual =
        new Date().toLocaleString("pt-BR");

    await addDoc(
        collection(db, "veiculos"),
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

    carregarVeiculos();
}

window.excluirVeiculo = async function(id){

    if(!confirm("Deseja excluir?"))
        return;

    await deleteDoc(
        doc(db, "veiculos", id)
    );

    carregarVeiculos();
}

function atualizarDashboard(){

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

    alert(
        "Relatório gerado e copiado para a área de transferência."
    );
}

btnAdicionar.addEventListener(
    "click",
    adicionarVeiculo
);

btnRelatorio.addEventListener(
    "click",
    gerarRelatorio
);

carregarVeiculos();