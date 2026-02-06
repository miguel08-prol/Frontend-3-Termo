       function executargastos() {
            var salario = document.getElementById('salario').value;
            var aluguel = document.getElementById('aluguel').value;
            var alimentacao = document.getElementById('alimentacao').value;
            var lazer = document.getElementById('lazer').value;


            salario = Number(salario);
            aluguel = Number(aluguel);
            alimentacao = Number(alimentacao);
            lazer = Number(lazer);

            const despesa = aluguel + alimentacao + lazer
            const gasto = salario - despesa

            if (gasto > 0) {
                alert("Saldo positivo,ta no lucro.");
            } 
            else if (gasto == 0) {
                alert("No limite hein!!");
            }else {alert("Saldo Negativo")}
        
        }