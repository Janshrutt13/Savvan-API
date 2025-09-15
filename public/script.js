document.addEventListener('DOMContentLoaded' , () => {
   const moodform = document.getElementById('mood-form');
   const cityform = document.getElementById('city-form');
   const cityInput = document.getElementById('city-input');
   const moodInput = document.getElementById('mood-input');
   const resultsContainer = document.getElementByIdx('results-container');


   cityform.addEventListener('submit' , (e) => {
      e.preventDefault();
      const city = cityInput.value;
      fetchPlaylists(`/api/suggestion?city=${encodeURIComponent(city)}`);
   });

   moodform.addEventListener('submit' , (e) => {
      e.preventDefault();
      const mood = moodInput.value;
      fetchPlaylists(`/api/suggestion?city=${encodeURIComponent(mood)}`);
   });

   async function fetchPlaylists(url){
     resultsContainer.innerHTML = '<p>Loading</p>';

     try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Something is wrong, Please try again!");
        }
        const data = await response.json();
        displayresults(data);
     }catch(err){
        resultsContainer.innerHTML = `<p style="color: red;">${err.message}</p>`;
     }
   }

   function displayresults(data){
      if(!data.playlists || data.playlists.length === 0){
        resultsContainer.innerHTML = '<p>No playlists found. Try another search.</p>';
        return;
      }

      let html = `<h3>${data.message}</h3><ul>`
      data.playlists.forEach(playlists => {
        html += 
          `
           <li>
             <a href = "${playlists.url} target = "blank" >${playlists.name}</a>
             <span class = "owner">by ${playlists.owner}</span>
           </li>
          `;
      });
      html += '</ul>';
      resultsContainer.innerHTML = html;
   }
});