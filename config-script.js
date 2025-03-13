function showModal(category) {
    document.querySelectorAll('.category').forEach(cat => {
        cat.style.display = 'none';
    });
    document.getElementById(category).style.display = 'block';
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function updateIndex() {
    const fields = [
        'dia-semana', 'dia-mes', 'nome-locutor1', 'vendedor1-locutor1', 'vendedor2-locutor1', 'vendedor3-locutor1',
        'nome-locutor2', 'vendedor1-locutor2', 'vendedor2-locutor2', 'vendedor3-locutor2', 'segundo-locutor',
        'ester', 'sabrina', 'stefani', 'juliana', 'agenda-semana', 'videos-semana', 'metricas-meta-business',
        'informacoes-semana', 'clientes-vendas', 'vendedor1-atendidos-vendas', 'total-vendas', 'coisas-para-serem-feitas'
    ];

    fields.forEach(field => {
        const value = document.getElementById(field).type === 'checkbox' ? document.getElementById(field).checked : document.getElementById(field).value;
        localStorage.setItem(field, value);
    });

    // Calculate total sales for locutor1
    const vendedor1Locutor1 = document.getElementById('vendedor1-locutor1').value.split('|').map(Number);
    const vendedor2Locutor1 = document.getElementById('vendedor2-locutor1').value.split('|').map(Number);
    const vendedor3Locutor1 = document.getElementById('vendedor3-locutor1').value.split('|').map(Number);
    const totalLocutor1 = vendedor1Locutor1.concat(vendedor2Locutor1, vendedor3Locutor1).reduce((a, b) => a + b, 0);
    localStorage.setItem('total-locutor1', totalLocutor1);

    // Calculate total sales for locutor2
    const vendedor1Locutor2 = document.getElementById('vendedor1-locutor2').value.split('|').map(Number);
    const vendedor2Locutor2 = document.getElementById('vendedor2-locutor2').value.split('|').map(Number);
    const vendedor3Locutor2 = document.getElementById('vendedor3-locutor2').value.split('|').map(Number);
    const totalLocutor2 = vendedor1Locutor2.concat(vendedor2Locutor2, vendedor3Locutor2).reduce((a, b) => a + b, 0);
    localStorage.setItem('total-locutor2', totalLocutor2);

    // Calculate total sales for TWhite Wave
    const ester = parseInt(document.getElementById('ester').value.split('=')[1]);
    const sabrina = parseInt(document.getElementById('sabrina').value.split('=')[1]);
    const stefani = parseInt(document.getElementById('stefani').value.split('=')[1]);
    const juliana = parseInt(document.getElementById('juliana').value.split('=')[1]);
    const totalTWhiteWave = ester + sabrina + stefani + juliana;
    localStorage.setItem('total-twhite-wave', totalTWhiteWave);

    alert('Informações atualizadas com sucesso!');
    closeModal();
}

// Attach event listeners to all input fields to send updates automatically
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateIndex);
});
