document.addEventListener('DOMContentLoaded', () => {
    const pokemonInfo = document.getElementById('pokemon-info');

    // Define the Pokémon list to display. You can modify this list to include more or different Pokémon.
    const pokemonList = ['pikachu', 'charmander', 'bulbasaur', 'squirtle', 'eevee'];

    const fetchPokemonData = async (pokemonName) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Pokémon not found.');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching data for ${pokemonName}: ${error.message}`);
            return null;
        }
    };

    const fetchSpeciesData = async (speciesUrl) => {
        try {
            const response = await fetch(speciesUrl);
            if (!response.ok) throw new Error('Species data not found.');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching species data: ${error.message}`);
            return null;
        }
    };

    const fetchEvolutionData = async (evolutionChainUrl) => {
        try {
            const response = await fetch(evolutionChainUrl);
            if (!response.ok) throw new Error('Evolution chain data not found.');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching evolution data: ${error.message}`);
            return null;
        }
    };

    const displayPokemonList = async () => {
        for (const name of pokemonList) {
            const pokemonData = await fetchPokemonData(name);
            if (pokemonData) {
                const speciesData = await fetchSpeciesData(pokemonData.species.url);
                if (speciesData) {
                    const evolutionData = await fetchEvolutionData(speciesData.evolution_chain.url);
                    if (evolutionData) {
                        displayPokemon(pokemonData, evolutionData);
                    }
                }
            }
        }
    };

    function displayPokemon(pokemon, evolutionData) {
        const evolutionChain = getEvolutionChain(evolutionData);

        pokemonInfo.innerHTML += `
            <div class="card mb-4">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
                <div class="card-body">
                    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                    <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                    <p><strong>Stats:</strong></p>
                    <ul>
                        ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                    <p><strong>Evolution Chain:</strong></p>
                    <ul>
                        ${evolutionChain.map(poke => `<li>${poke}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    function getEvolutionChain(evolutionData) {
        const chain = evolutionData.chain;
        const evolutions = [];
        
        function traverseEvolutions(chain) {
            if (chain.species) {
                evolutions.push(chain.species.name.charAt(0).toUpperCase() + chain.species.name.slice(1));
            }
            if (chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(next => traverseEvolutions(next));
            }
        }

        traverseEvolutions(chain);

        return evolutions;
    }

    // Call the function to display the list of Pokémon
    displayPokemonList();
});
