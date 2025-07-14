document.addEventListener('DOMContentLoaded', function() {
    // --- Animação da Seção de Perfil (já existente) ---
    const profileElements = document.querySelectorAll('.hidden-profile-element');

    function animateProfileElements(elements) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible-profile-element');
            }, 300 * (index + 1));
        });
    }

    animateProfileElements(profileElements);

    // --- Exibição de Projetos do GitHub em Cards ---
    const githubUsername = 'nicolasgabrielmartins'; // Seu nome de usuário do GitHub
    const projectsGrid = document.querySelector('.projects-grid');

    // Função para buscar os repositórios do GitHub
    async function fetchGithubProjects() {
        try {
            // Busca os repositórios, incluindo detalhes de linguagem
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc&per_page=9`); // Pega os 9 últimos criados
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projectsData = await response.json();
            
            // Filtra por repositórios que não são forks e que você quer mostrar
            const filteredProjects = projectsData.filter(repo => !repo.fork);
            
            displayProjects(filteredProjects);
        } catch (error) {
            console.error("Erro ao buscar projetos do GitHub:", error);
            projectsGrid.innerHTML = '<p class="loading-message">Erro ao carregar projetos. Por favor, tente novamente mais tarde.</p>';
        }
    }

    // Função para buscar as linguagens de um repositório (requisição separada)
    async function fetchRepoLanguages(repoUrl) {
        try {
            const response = await fetch(repoUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const languages = await response.json();
            // Retorna um array com os nomes das linguagens
            return Object.keys(languages);
        } catch (error) {
            console.error("Erro ao buscar linguagens do repositório:", error);
            return []; // Retorna um array vazio em caso de erro
        }
    }

    // Função para exibir os projetos como cards
    async function displayProjects(projects) {
        projectsGrid.innerHTML = ''; // Limpa a mensagem de carregamento
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p class="loading-message">Nenhum projeto público encontrado com descrição. Crie alguns projetos ou adicione descrições a eles!</p>';
            return;
        }

        for (const project of projects) {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');

            // Formatar a data de criação
            const createdAt = new Date(project.created_at).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Buscar linguagens (assíncrono)
            const languages = await fetchRepoLanguages(project.languages_url);
            const languagesText = languages.length > 0 ? languages.join(', ') : 'N/A';

            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>Criado em: ${createdAt}</p>
                <p class="languages">Linguagens: ${languagesText}</p>
                <a href="${project.html_url}" target="_blank">Ver mais</a>
            `;
            projectsGrid.appendChild(projectCard);
        }
    }

    // Chama a função para buscar os projetos quando a página carregar
    fetchGithubProjects();
});