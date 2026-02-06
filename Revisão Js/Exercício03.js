        function limparNomeContato(nome) {
            let formatado = nome.trim().toUpperCase();
            
            let totalPalavras = formatado.split(" ").length;

            alert("Nome: " + formatado + "\nTotal de palavras: " + totalPalavras);
            
            return formatado;
        }

        function executarAgenda() {
            let valorInput = document.getElementById("campoNome").value;
            limparNomeContato(valorInput);
        }