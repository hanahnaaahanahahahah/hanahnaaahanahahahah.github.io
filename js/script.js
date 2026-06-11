document.addEventListener("DOMContentLoaded", () => {

    // Evita inicialização duplicada
    if (window.controlesInicializados) return;
    window.controlesInicializados = true;

    const criarPainelControles = () => {

        // Evita criar o painel duas vezes
        if (document.querySelector(".painel-controles")) {
            return;
        }

        const painel = document.createElement("div");
        painel.className = "painel-controles";

        document.body.appendChild(painel);
    };

    criarPainelControles();

    const inicializarModoNoturno = () => {

        const btnDarkMode = document.getElementById("btn-dark-mode");

        if (!btnDarkMode) return;

        if (localStorage.getItem("tema") === "dark") {
            document.body.classList.add("dark-mode");
            btnDarkMode.textContent = "Modo Claro";
        }

        btnDarkMode.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("tema", "dark");
                btnDarkMode.textContent =  "Modo Claro";
            } else {
                localStorage.setItem("tema", "light");
                btnDarkMode.textContent = "Modo Noturno";
            }
        });
    };

    const inicializarAjusteFonte = () => {

        const btnAumentar = document.getElementById("btn-font-increase");
        const btnDiminuir = document.getElementById("btn-font-decrease");

        let tamFonteAtual =
            parseInt(localStorage.getItem("fontSize")) || 100;

        document.documentElement.style.fontSize =
            `${tamFonteAtual}%`;

        if (!btnAumentar || !btnDiminuir) return;

        btnAumentar.addEventListener("click", () => {

            if (tamFonteAtual < 140) {

                tamFonteAtual += 10;

                document.documentElement.style.fontSize =
                    `${tamFonteAtual}%`;

                localStorage.setItem("fontSize", tamFonteAtual);
            }
        });

        btnDiminuir.addEventListener("click", () => {

            if (tamFonteAtual > 80) {

                tamFonteAtual -= 10;

                document.documentElement.style.fontSize =
                    `${tamFonteAtual}%`;

                localStorage.setItem("fontSize", tamFonteAtual);
            }
        });
    };

    inicializarModoNoturno();
    inicializarAjusteFonte();

    const criarMensagemFeedback = () => {

        const feedback = document.createElement("div");
        feedback.id = "feedback-mensagem";

        document.body.appendChild(feedback);

        return feedback;
    };

    const mostrarFeedback = (tipo, mensagens) => {

        let feedback = document.getElementById("feedback-mensagem");

        if (feedback) {
            feedback.remove();
        }

        feedback = criarMensagemFeedback();

        feedback.className =
            tipo === "erro"
                ? "feedback-erro"
                : "feedback-sucesso";

        let conteudo = "";

        if (tipo === "erro") {

            conteudo = "<strong>Erro na validação:</strong><ul>";

            mensagens.forEach(msg => {
                conteudo += `<li>${msg}</li>`;
            });

            conteudo += "</ul>";

        } else {

            conteudo =
                "✓ Obrigado pelo contato! Sua mensagem foi validada com sucesso.";
        }

        feedback.innerHTML = conteudo;

        setTimeout(() => {

            feedback.classList.add("feedback-saindo");

            setTimeout(() => {
                feedback.remove();
            }, 300);

        }, tipo === "erro" ? 8000 : 5000);
    };

    const formContato = document.querySelector("form");

    if (formContato) {

        formContato.addEventListener("submit", (event) => {

            event.preventDefault();

            let erros = [];

            const nome = document.getElementById("nome")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const telefone = document.getElementById("telefone")?.value.trim() || "";
            const assunto = document.getElementById("assunto")?.value || "";
            const mensagem = document.getElementById("mensagem")?.value.trim() || "";

            if (nome.length < 3) {
                erros.push("O nome deve ter no mínimo 3 caracteres.");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                erros.push("Por favor, insira um e-mail válido.");
            }

            if (telefone.length > 0) {

                const telefoneRegex = /^[\d\s()+-]*$/;

                if (
                    !telefoneRegex.test(telefone) ||
                    telefone.replace(/\D/g, "").length < 10
                ) {
                    erros.push("Telefone inválido. Use o formato: (00) 00000-0000");
                }
            }

            if (assunto === "") {
                erros.push("Por favor, selecione um assunto.");
            }

            if (mensagem.length < 10) {
                erros.push("Sua mensagem deve ter no mínimo 10 caracteres.");
            }

            if (erros.length > 0) {

                mostrarFeedback("erro", erros);

            } else {

                console.log("Dados do formulário válidos:", {
                    nome,
                    email,
                    telefone,
                    assunto,
                    mensagem
                });

                mostrarFeedback("sucesso", []);

                formContato.reset();
            }
        });
    }
});