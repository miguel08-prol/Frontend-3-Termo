        let dataHoje = new Date(); 
        let dataEvento = new Date("2026-02-25");

        let diferencaMs = dataEvento - dataHoje;

        let msPorDia = 24 * 60 * 60 * 1000;
        let diasFaltando = diferencaMs / msPorDia;

        let resultadoFinal = Math.ceil(diasFaltando);

        alert("Faltam " + resultadoFinal + " dias para o seu compromisso!");