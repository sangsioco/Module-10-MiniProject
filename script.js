// Script for homepage.html

document.addEventListener("DOMContentLoaded", function() {
    const pokeball = document.getElementById("pokeball");

    pokeball.addEventListener("click", function() {
        if (pokeball.src.includes("pokeball_close.png")) {
            pokeball.src = "pokeball_open.png";
        } else {
            pokeball.src = "pokeball_close.png";
        }
        pokeball.classList.toggle("open");
    });
});

// script to search for pokemon (search.html)
document.getElementById('pokemon-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const pokemonInput = document.getElementById('pokemon-input').value.trim().toLowerCase();
    const pokemonInfo = document.getElementById('pokemon-info');
    pokemonInfo.innerHTML = ''; // Clear previous search result
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInput}`);
        
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }

        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        pokemonInfo.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
});

function displayPokemon(pokemon) {
    const pokemonInfo = document.getElementById('pokemon-info');
    pokemonInfo.innerHTML = `
        <div class="card">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image card-img-top">
            <div class="card-body">
                <h2 class="card-title">${pokemon.name}</h2>
                <p class="card-text"><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p class="card-text"><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                <p class="card-text"><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                <p class="card-text"><strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            </div>
        </div>
    `;
}

// script needed for generation.html
async function fetchGenerations() {
    const response = await fetch('https://pokeapi.co/api/v2/generation');
    const data = await response.json();
    displayGenerations(data.results);
    populateDropdown(data.results);
}

function displayGenerations(generations) {
    const generationCards = document.getElementById('generation-cards');
    generationCards.innerHTML = generations.map((gen, index) => `
        <div class="col-md-4 generation-card" id="generation-${index + 1}" style="display: none;">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${gen.name.charAt(0).toUpperCase() + gen.name.slice(1)}</h5>
                    <button class="btn btn-primary mt-auto generation-button" data-url="${gen.url}">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.generation-button').forEach(button => {
        button.addEventListener('click', async () => {
            const url = button.getAttribute('data-url');
            const response = await fetch(url);
            const data = await response.json();
            displayGenerationInfo(data, button);
        });
    });
}

function populateDropdown(generations) {
    const dropdownMenu = document.getElementById('generation-dropdown-menu');
    dropdownMenu.innerHTML = generations.map((gen, index) => `
        <a class="dropdown-item" href="#" data-id="generation-${index + 1}">${gen.name.charAt(0).toUpperCase() + gen.name.slice(1)}</a>
    `).join('');

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            document.querySelectorAll('.generation-card').forEach(card => {
                card.style.display = 'none';
            });
            document.getElementById(id).style.display = 'flex'; // Changed from 'block' to 'flex' to center cards properly
        });
    });
}

function displayGenerationInfo(generation, button) {
    const cardBody = button.parentElement;
    cardBody.innerHTML = `
        <h5 class="card-title">${generation.name.charAt(0).toUpperCase() + generation.name.slice(1)}</h5>
        <p><strong>Main Region:</strong> ${generation.main_region.name}</p>
        <h6>Pokémon Species:</h6>
        <ul>
            ${generation.pokemon_species.map(species => `
                <li>${species.name}</li>
            `).join('')}
        </ul>
        <button class="btn btn-secondary mt-auto back-button">Back</button>
    `;

    cardBody.querySelector('.back-button').addEventListener('click', () => {
        cardBody.innerHTML = `
            <h5 class="card-title">${generation.name.charAt(0).toUpperCase() + generation.name.slice(1)}</h5>
            <button class="btn btn-primary mt-auto generation-button" data-url="${generation.url}">View Details</button>
        `;

        cardBody.querySelector('.generation-button').addEventListener('click', async () => {
            const url = generation.url;
            const response = await fetch(url);
            const data = await response.json();
            displayGenerationInfo(data, cardBody.querySelector('.generation-button'));
        });
    });
}

fetchGenerations();