document.addEventListener('DOMContentLoaded' , () => {
    const moodform = document.getElementById('mood-form');
    const cityform = document.getElementById('city-form');
    const cityInput = document.getElementById('city-input');
    const moodInput = document.getElementById('mood-input');
    const resultsContainer = document.getElementById('results-container');
    const loader = document.getElementById('loader');
    const moodTags = document.querySelectorAll('.tag'); // Corrected: Renamed variable to moodTags for clarity

    cityform.addEventListener('submit' , (e) => {
       e.preventDefault();
       const city = cityInput.value;
       fetchPlaylists(`/api/suggestion?city=${encodeURIComponent(city)}`);
    });

    moodform.addEventListener('submit' , (e) => {
       e.preventDefault();
       const mood = moodInput.value;
       fetchPlaylists(`/api/suggestion?mood=${encodeURIComponent(mood)}`);
    });

    // Corrected: Using the 'moodTags' variable defined above
    moodTags.forEach(tag => {
        tag.addEventListener('click', () => {
            moodInput.value = tag.textContent;
            moodform.dispatchEvent(new Event('submit'));
        });
    });

    async function fetchPlaylists(url){
      resultsContainer.innerHTML = '';
      loader.style.display = 'flex';

      try{
         const response = await fetch(url);
         if(!response.ok){
             throw new Error("Something is wrong, Please try again!");
         }
         const data = await response.json();
         displayresults(data);
      }catch(err){
          resultsContainer.innerHTML = `<p style="color: red;">${err.message}</p>`;
      }finally{
          loader.style.display = 'none';
      }
    }

    function displayresults(data){
       if(!data.playlists || data.playlists.length === 0){
         resultsContainer.innerHTML = '<p>No playlists found. Try another search.</p>'; // Added a message here
         return;
       }

       let html = `<h3>${data.message}</h3><ul>`;
       // Using 'playlist' (singular) for each item in the loop is clearer
       data.playlists.forEach(playlist => {
          html += 
            `
              <li>
                <img src="${playlist.imageUrl}" alt="${playlist.name} cover" class="playlist-art">
                <div class="playlist-info">
                   <a href="${playlist.url}" target="_blank">${playlist.name}</a>
                   <span class="owner">by ${playlist.owner}</span>
                </div>
              </li>
            `;
       });
       html += '</ul>';
       resultsContainer.innerHTML = html;
    }
});