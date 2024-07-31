document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://dummyjson.com/users?limit=10';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta da rede não foi ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados da API:', data);

            const users = data.users;

            if (!users || !Array.isArray(users)) {
                console.error('Dados de usuários não estão no formato esperado.');
                return;
            }

            const userContainer = document.getElementById('user-container');
            const usersByState = {};

            users.forEach(user => {
                const state = user.address?.state || 'Desconhecido';
                if (!usersByState[state]) {
                    usersByState[state] = [];
                }
                usersByState[state].push(user);
            });

            userContainer.innerHTML = '';

            const sortedStates = Object.keys(usersByState).sort();
            sortedStates.forEach(state => {

                const stateSection = document.createElement('div');
                stateSection.className = 'state-section';

                const stateTitle = document.createElement('h2');
                stateTitle.className = 'state-title';
                stateTitle.textContent = state;

                stateSection.appendChild(stateTitle);

                usersByState[state].sort((a, b) => {
                    if (!a.name || !b.name) {
                        console.error('Nome do usuário está ausente:', a, b);
                        return 0;
                    }
                    return a.name.localeCompare(b.name);
                });

                usersByState[state].forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.className = 'user-card';
                    userCard.innerHTML = `<strong>${user.name}</strong> <br> <span>Username: ${user.username}</span> <br> <span>Endereço: ${user.address?.state || 'Desconhecido'}</span>`;
                    stateSection.appendChild(userCard);
                });

                userContainer.appendChild(stateSection);
            });
        })
        .catch(error => console.error('Erro ao buscar usuários:', error));
});
