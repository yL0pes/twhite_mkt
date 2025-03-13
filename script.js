document.addEventListener('DOMContentLoaded', () => {
    function updateContent(selector, content) {
        document.querySelector(selector).textContent = content;
    }

    const fields = [
        'dia-semana', 'dia-mes', 'nome-locutor1', 'vendedor1-locutor1', 'vendedor2-locutor1', 'vendedor3-locutor1',
        'nome-locutor2', 'vendedor1-locutor2', 'vendedor2-locutor2', 'vendedor3-locutor2', 'segundo-locutor',
        'ester', 'sabrina', 'stefani', 'juliana', 'agenda-semana', 'videos-semana', 'metricas-meta-business',
        'informacoes-semana', 'clientes-vendas', 'vendedor1-atendidos-vendas', 'total-vendas', 'coisas-para-serem-feitas'
    ];

    fields.forEach(field => {
        const value = localStorage.getItem(field);
        if (value !== null) {
            if (field === 'segundo-locutor') {
                document.getElementById('locutor2').style.display = value === 'true' ? 'block' : 'none';
            } else {
                updateContent(`#${field}`, value);
            }
        }
    });

    const diaSemana = localStorage.getItem('dia-semana');
    const diaMes = localStorage.getItem('dia-mes');
    if (diaSemana && diaMes) {
        updateContent('#dia-semana-mes', `${diaSemana} ${diaMes}`);
    }

    const totalLocutor1 = localStorage.getItem('total-locutor1');
    if (totalLocutor1 !== null) {
        updateContent('#total-locutor1', `TOTAL: ${totalLocutor1}`);
    }

    const totalLocutor2 = localStorage.getItem('total-locutor2');
    if (totalLocutor2 !== null) {
        updateContent('#total-locutor2', `TOTAL: ${totalLocutor2}`);
    }

    const totalTWhiteWave = localStorage.getItem('total-twhite-wave');
    if (totalTWhiteWave !== null) {
        updateContent('#total-twhite-wave', `TOTAL = ${totalTWhiteWave}`);
    }

    // Listen for messages from config.html
    window.addEventListener('message', (event) => {
        const data = event.data;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'segundo-locutor') {
                document.getElementById('locutor2').style.display = value ? 'block' : 'none';
            } else {
                updateContent(`#${key}`, value);
            }
        }
    });
});
