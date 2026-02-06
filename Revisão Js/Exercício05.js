        let agendaHorarios = [8, 12, 25, 15, -2, 20];

        for (let i = 0; i < agendaHorarios.length; i++) {
            let horario = agendaHorarios[i];

            if (horario >= 0 && horario <= 23) {
                alert("Compromisso agendado para as " + horario + "h.");
            } else {
                alert("Atenção: O horário " + horario + "h é inválido!");
            }
        }