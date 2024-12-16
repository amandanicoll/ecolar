
document.addEventListener("DOMContentLoaded", () => {
    const botaoLogin = document.querySelector(".botaoLogin");
    const botaoLimpar = document.querySelector(".botaoLimpar");

    // Função de cadastro
    botaoLogin.addEventListener("click", async () => {
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const tipo = document.querySelector('input[name="usuarios"]:checked')?.value;

        // Validação
        if (!nome || !email || !senha || !tipo) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Enviar dados para o servidor
        try {
            const response = await fetch("http://localhost:2000/usuarios/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    tipo
                }),
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                // Limpar campos após cadastro
                document.getElementById("nome").value = "";
                document.getElementById("email").value = "";
                document.getElementById("senha").value = "";
                window.location.href="../index.html";
            }
        } catch (error) {
            alert("Erro ao tentar cadastrar.");
        }
    });

    botaoLimpar.addEventListener("click", () => {
        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
    });
});