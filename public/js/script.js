const apiUrl = 'https://geo.api.gouv.fr/communes?codePostal';

const zipcode = document.getElementById('zipcode');
const cityList = document.getElementById('cityList');
const cityField = document.getElementById('city');

if (zipcode) {
    zipcode.addEventListener('input', async () => {
        if (zipcode.value.length === 5) {
            await searchCities();
        }
    });
}

async function searchCities() {
    try {
        if (zipcode.value.length !== 5) return;
        const response = await fetch(`${apiUrl}=${encodeURIComponent(zipcode.value)}`);
        if (!response.ok) return;
        const communes = await response.json();
        const target = cityList || cityField;
        if (!target) return;
        target.textContent = '';
        for (const commune of communes) {
            const option = document.createElement('option');
            option.textContent = commune.nom;
            option.value = commune.nom;
            target.append(option);
        }
    } catch (error) {
        console.log("Une erreur s'est produite lors de la recherche des villes");
    }
}
