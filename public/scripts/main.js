    const games = [
      { title: 'мой title', genre: 'Аркада', rating: 4.7, img: '/assets/imgs/games_logo/Among Us! - Apple App Store - Russia - Category Rankings, Keyword Rankings, Sales Rankings, Research, Performance, and Growth Metrics_.jpg' },
      { title: 'Block Merge', genre: 'Головоломка', rating: 4.4, img: '/assets/imgs/games_logo/ICO.jpg' },
      { title: 'Turbo Track', genre: 'Гонки', rating: 4.6, img: '/assets/imgs/games_logo/Stumble guys.jpg' },
      { title: 'Battle Lobby', genre: 'Мультиплеер', rating: 4.2, img: '/assets/imgs/games_logo/Surf the Subway.jpg' },
      { title: 'Mystic Match', genre: 'Головоломка', rating: 4.5, img: '/assets/imgs/games_logo/ред булл 4.jpg' },
      { title: 'Pixel Runner', genre: 'Аркада', rating: 4.3, img: 'assets/imgs/games_logo/Энгри бердс топ.jpg' },
      { title: 'Drift King', genre: 'Гонки', rating: 4.1, img: '/assets/imgs/games_logo/Fortnite - Apps on Google Play.jpg' },
      { title: 'Team Clash', genre: 'Мультиплеер', rating: 4.0, img: '/assets/imgs/games_logo/Enter the Arena! Build your Battle Deck and outsmart the enemy in fast real-time battles_ From the creators of CLASH OF CLANS comes a real-time multiplayer batt….jpg' }
    ];

    function populateSection(gridId, items) {
      const grid = document.getElementById(gridId);
      const tpl = document.getElementById('card-template');
      items.forEach(game => {
        const clone = tpl.content.cloneNode(true);
        clone.querySelector('img').src = game.img;
        clone.querySelector('img').alt = game.title;
        clone.querySelector('h3').textContent = game.title;
        clone.querySelector('p').textContent = `${game.genre} • ${game.rating}`;
        clone.querySelector('button').onclick = () => alert('Запуск игры: ' + game.title);
        grid.appendChild(clone);
      });
    }

    populateSection('grid-new', games.slice(0, 4));
    populateSection('grid-popular', games.slice(2, 6));
    populateSection('grid-rec', games.slice(4, 8));