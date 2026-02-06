        function executarAgenda() {
            var hora = document.getElementById('campoHora').value;
            var prioridade = document.getElementById('campoPrioridade').value;

            hora = Number(hora);
            prioridade = Number(prioridade);

            // Validações Básicas
            if (hora < 0 || hora > 23) {
                alert("Horário Inválido");
            } 
            else if (prioridade < 1 || prioridade > 10) {
                alert("Nível de Prioridade Inválida");
            } 
            else {
                var turno = "";
                if (hora >= 0 && hora <= 11) {
                    turno = "Manhã";
                } else if (hora >= 12 && hora <= 17) {
                    turno = "Tarde";
                } else {
                    turno = "Noite";
                }
                if (prioridade > 8 && (turno == "Manhã" || turno == "Tarde")) {
                    alert("TAREFA CRÍTICA/URGENTE");
                } 
                else if (prioridade >= 7 && prioridade < 9 && (turno == "Manhã" || turno == "Tarde")) {
                    alert("TAREFA IMPORTANTE");
                } 
                else if (turno == "Noite") {
                    alert("TAREFA NÃO IMPORTANTE (Hora de lazer)");
                } 
                else {
                    alert("Tarefa normal de rotina");
                }
            }
        }