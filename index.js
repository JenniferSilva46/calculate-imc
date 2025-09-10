
const CLASSIFICATION = ["Abaixo do peso", "Peso normal", "Sobrepeso", "Obesidade"];

class Person {
    constructor(height, weight) {

        if (!height || !weight) {
            !height ? document.getElementById(`error-message-height`).innerText = "Campo obrigatório" : document.getElementById(`error-message-height`).innerText = "";
            !weight ? document.getElementById("error-message-weight").innerText = "Campo obrigatório" : document.getElementById("error-message-weight").innerText = "";
            throw new Error("Height and weight are required");
        }

        this.height = height;
        this.weight = weight;
    }
}

class Nutritionist extends Person {
    constructor(height, weight) {
        super(height, weight);
        this.imcValue = 0;
        this.imcDescription = "";
    }

    imc = async function () {
        return calculaImc(this);
    };
}

function calculaImc(nutricionista) {
    const altura = nutricionista.height;
    const peso = nutricionista.weight;

    if (!altura || !peso) {
        throw new Error("Altura e peso são obrigatórios");
    }

    const imc = peso / (altura * altura);
    nutricionista.imcValue = imc;

    if (imc < 18.4) {
        nutricionista.imcDescription = CLASSIFICATION[0];
    } else if (imc < 24.9) {
        nutricionista.imcDescription = CLASSIFICATION[1];
    } else if (imc < 29.9) {
        nutricionista.imcDescription = CLASSIFICATION[2];
    } else {
        nutricionista.imcDescription = CLASSIFICATION[3];
    }

    return nutricionista;
}

function getColorForClassificacao(classificacao, destaque) {
    switch (classificacao) {
        case CLASSIFICATION[0]:
            return destaque ? "blue" : "none";
        case CLASSIFICATION[1]:
            return destaque ? "green" : "none";
        case CLASSIFICATION[2]:
            return destaque ? "orange" : "none";
        case CLASSIFICATION[3]:
            return destaque ? "red" : "none";
        default:
            return "black";
    }
}


function renderizaTabelaIMC(imc) {
   const intervalos = [
       { min: 0, max: 18.4, classificacao: CLASSIFICATION[0] },
       { min: 18.4, max: 24.9, classificacao: CLASSIFICATION[1] },
       { min: 24.9, max: 29.9, classificacao: CLASSIFICATION[2] },
       { min: 29.9, max: Infinity, classificacao: CLASSIFICATION[3] }
   ];

   let html = `
        <table id='table-imc'>
            <thead>
                <tr>
                    <th>Classifica&ccedil;&atilde;o</th>
                    <th>IMC</th>
                </tr>
            </thead>
            <tbody>
   `;

   intervalos.forEach((x) => {
        const intervalo = x.min + " - " + x.max;
        const destaque = (imc >= x.min && imc < x.max) ? true : false;
        html += `<tr class='${destaque ? "destaque-imc" : ""}' style='background-color: ${getColorForClassificacao(x.classificacao, destaque)}; color: ${destaque ? "#FFF" : "#666"};'>
            <td>${x.classificacao}</td>
            <td>${intervalo}</td>
        </tr>`;
   });
   html += "</tbody></table>";
   document.getElementById("table-imc-container").innerHTML = html;
}

function renderizaResultadoIMC(nutritionist) {
    console.log(nutritionist);
    nutritionist.imc()
        .then(() => {
            document.getElementById("imc").innerText =
                nutritionist.imcValue.toFixed(0) + " - " + nutritionist.imcDescription;
            renderizaTabelaIMC(parseFloat(nutritionist.imcValue.toFixed(0)));
        });
}

function actionCalcularIMCBuilder() {
    var heightEl = document.getElementById("height-value");
    var weightEl = document.getElementById("weight-value");

    return function actionCalcularIMC(evt) {
        
        evt.preventDefault();

        const nutricionista = new Nutritionist(
            parseFloat(heightEl.value),
            parseFloat(weightEl.value)
        );
        renderizaResultadoIMC(nutricionista);
    }
}

window.onload = function () {
    document
        .getElementById("calculate")
        .addEventListener("click", actionCalcularIMCBuilder())
        .getElementById("height-value").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                document.getElementById("calculate").click();
            }
        })
        .getElementById("weight-value").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                document.getElementById("calculate").click();
            }
        });
};
