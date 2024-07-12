// generation.js

document.addEventListener('DOMContentLoaded', () => {
    const generationCards = document.getElementById('generation-cards');
    const generationHeading = document.getElementById('generation-heading');

    // Get the generation parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const generation = params.get('generation');

    if (generation) {
        // Set the generation title
        generationHeading.textContent = `Generation ${generation}`;

        fetch(`https://pokeapi.co/api/v2/pokemon?limit=150&offset=${(generation - 1) * 150}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(pokemon => {
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .then(pokemonData => {
                            const card = `
                                <div class="col-md-3 mb-4">
                                    <div class="card">
                                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png" class="card-img-top" alt="${pokemonData.name}">
                                        <div class="card-body">
                                            <h5 class="card-title">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h5>
                                        </div>
                                    </div>
                                </div>
                            `;
                            generationCards.innerHTML += card;
                        });
                });
            })
            .catch(error => console.error('Error fetching Pokémon data:', error));
    } else {
        generationCards.innerHTML = '<p>Please select a generation from the dropdown.</p>';
    }
});
