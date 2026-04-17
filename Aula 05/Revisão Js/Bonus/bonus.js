   let agendaHorarios = [8, 12, 25, 15, -2, 20];
                let contagemValidos = 0;

        for (let i = 0; i < agendaHorarios.length; i++) {
            let horario = agendaHorarios[i];

            if (horario >= 0 && horario <= 23) {
                alert("Compromisso agendado para as " + horario + "h.");
            contagemValidos = contagemValidos + 1; 
            } else {
                alert("Atenção: O horário " + horario + "h é inválido!");
            }
        }

       alert("---------------------------------------");
        alert("Total de compromissos válidos: " + contagemValidos);