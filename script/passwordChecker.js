const API_URL = "http://localhost:5085/api/Password/analyze";

document.addEventListener("DOMContentLoaded", () => {
    const btnAnalisar = document.getElementById("btnAnalisar");
    const btnMostrarSenha = document.getElementById("btnMostrarSenha");
    const inputSenha = document.getElementById("inputSenha");
    const btnGerarSenha = document.getElementById("btnGerarSenha");
    const btnCopiarSenha = document.getElementById("btnCopiarSenha");

    btnMostrarSenha.addEventListener("click", () => {
        inputSenha.type = inputSenha.type === "password" ? "text" : "password";
    });

    btnAnalisar.addEventListener("click", analisarSenha);
    inputSenha.addEventListener("keypress", (e) => {
        if (e.key === "Enter") analisarSenha();
    });

    if (btnGerarSenha) {
        btnGerarSenha.addEventListener("click", gerarSenhaSegura);
    }

    if (btnCopiarSenha) {
        btnCopiarSenha.addEventListener("click", copiarSenhaGerada);
    }
});

async function analisarSenha() {
    const senha = document.getElementById("inputSenha").value;
    const resultado = document.getElementById("resultado");
    const erroMsg = document.getElementById("erroMsg");
    const btnAnalisar = document.getElementById("btnAnalisar");

    erroMsg.style.display = "none";

    if (!senha) {
        erroMsg.textContent = "Digite uma senha antes de analisar.";
        erroMsg.style.display = "block";
        return;
    }

    btnAnalisar.disabled = true;
    btnAnalisar.textContent = "Analisando...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: senha })
        });

        if (!response.ok) throw new Error("Erro na análise.");

        const data = await response.json();
        exibirResultado(data);
    } catch (err) {
        erroMsg.textContent = "Não foi possível conectar à API. Verifique se o backend está rodando.";
        erroMsg.style.display = "block";
        resultado.style.display = "none";
    } finally {
        btnAnalisar.disabled = false;
        btnAnalisar.textContent = "Analisar senha";
    }
}

function exibirResultado(data) {
    const resultado = document.getElementById("resultado");
    resultado.style.display = "block";

    document.getElementById("resClassificacao").textContent = data.classificacao;
    document.getElementById("resTempo").textContent = data.tempoParaQuebrar;

    const barra = document.getElementById("barraForca");
    const percentual = (data.score / 4) * 100;
    barra.style.width = percentual + "%";

    const cores = ["bg-danger", "bg-danger", "bg-warning", "bg-info", "bg-success"];
    barra.className = "progress-bar " + cores[data.score];

    const blocoComprometida = document.getElementById("blocoComprometida");
    if (data.comprometida) {
        blocoComprometida.style.display = "block";
        blocoComprometida.querySelector("span").textContent =
            `⚠️ Essa senha já apareceu em ${data.quantidadeVazamentos.toLocaleString('pt-BR')} vazamentos conhecidos!`;
    } else {
        blocoComprometida.style.display = "none";
    }

    const blocoPadroes = document.getElementById("blocoPadroes");
    const listaPadroes = document.getElementById("listaPadroes");
    listaPadroes.innerHTML = "";
    if (data.padroesDetectados && data.padroesDetectados.length > 0) {
        blocoPadroes.style.display = "block";
        data.padroesDetectados.forEach(p => {
            const li = document.createElement("li");
            li.textContent = p;
            listaPadroes.appendChild(li);
        });
    } else {
        blocoPadroes.style.display = "none";
    }

    const listaMelhorias = document.getElementById("listaMelhorias");
    listaMelhorias.innerHTML = "";
    data.melhorias.forEach(m => {
        const li = document.createElement("li");
        li.textContent = m;
        listaMelhorias.appendChild(li);
    });
}

function gerarSenhaSegura() {
    const tamanho = 16;
    const maiusculas = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const minusculas = "abcdefghijkmnpqrstuvwxyz";
    const numeros = "23456789";
    const simbolos = "!@#$%&*-_+=?";
    const todos = maiusculas + minusculas + numeros + simbolos;

    let senha = [
        maiusculas[randomSeguro(maiusculas.length)],
        minusculas[randomSeguro(minusculas.length)],
        numeros[randomSeguro(numeros.length)],
        simbolos[randomSeguro(simbolos.length)]
    ];

    for (let i = senha.length; i < tamanho; i++) {
        senha.push(todos[randomSeguro(todos.length)]);
    }

    for (let i = senha.length - 1; i > 0; i--) {
        const j = randomSeguro(i + 1);
        [senha[i], senha[j]] = [senha[j], senha[i]];
    }

    const senhaFinal = senha.join("");
    document.getElementById("senhaGerada").value = senhaFinal;
    document.getElementById("resultadoGerador").style.display = "block";
}

function randomSeguro(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

function copiarSenhaGerada() {
    const campo = document.getElementById("senhaGerada");
    campo.select();
    navigator.clipboard.writeText(campo.value).then(() => {
        const btn = document.getElementById("btnCopiarSenha");
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => { btn.innerHTML = textoOriginal; }, 1500);
    });
}