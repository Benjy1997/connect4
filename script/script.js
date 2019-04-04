var GAME_GRID = document.getElementById("tableId"); // Grille de jeu.
var isGameOver = false; //Détermine si le jeu est fini.
var computer = new AI(3);
var AIPlay = false;

/**
 * Attends le chargement du DOM.
 */
document.addEventListener("DOMContentLoaded", function(event) {



	// Clic sur le bouton "redémarrer une partie !".
	document.getElementById("RAZ").onclick = function () { reset(); };


	if (GAME_GRID != null) {

		// Gestion de l'event onclick sur chaque cellule du tableau HTML.
		for (var i = 0; i < GAME_GRID.rows.length; i++) {

			for (var j = 0; j < GAME_GRID.rows[i].cells.length; j++)

				GAME_GRID.rows[i].cells[j].onclick = function () { play(this); };
		}
	}
});

/**
 * Permet aux joueurs l'action de jouer.
 * Param cel : La cellule sur laquelle le joueur à cliqué.
 **/
function play(cel) {
	// Est-ce que le jeu est terminé ?
	if (isGameOver)
		return;

	// Récupère la classe de l'élément td.
	var col = cel.getAttribute("class");

	//Transforme la classe récupéré en index utilisable sur un tableau.
	// 1) Extrait le numéro contenue dans les classes.
	// 2) Convertit ces numéros en entier.
	// 3) Corrige le numéro pour qu'il corresponde à un index qui commence de 0.
	col = parseInt(col.substr(3,(col.length-2)))-1;

	display(col);

	col = computer.play(2);
	display(col);
	console.log('-----------------------------------------------------------------------------------------------------');
}

function display(col) {
	let cel;
	// Récupère le joueur courrant.
	var currentPlayer = document.getElementById("CurrentPlayer");
	// Parcoure toutes les lignes de la colonne cliqué.
	for (let i = GAME_GRID.rows.length-1; i >= 0;  i--) {
		cel = GAME_GRID.rows[i].cells[col].firstElementChild;

		// Ajoute une pièce à la grille de jeu si il n'y en à pas déjà une.
		if(cel.getAttribute("class") == null){
			cel.setAttribute("class", "fas fa-circle");

			// Détermine à quel joueur appartien la pièce.
			if (currentPlayer.dataset.color === "rouge"){
				currentPlayer.innerHTML = "Jaune doit jouer !";
				currentPlayer.setAttribute('data-color', 'jaune');
				cel.setAttribute("data-color", "rouge");
				cel.setAttribute("style", "color:Red");

			} else {
				currentPlayer.setAttribute('data-color', 'rouge');
				cel.setAttribute("data-color", "jaune");
				cel.setAttribute("style", "color:Gold");
				currentPlayer.innerHTML = "Rouge doit jouer !";
			}

			// Détermine s'il y a un gagnant.
			let winner = checkWin();
			if (winner !== null){
				isGameOver = true;
				winner = winner.charAt(0).toUpperCase() + winner.slice(1);
				alert("Le joueur " + winner + " a gagné !");
			}

			return;
		}
	}

}

/**
 * Détecte si un joueur obtien une combinaison gagnante.
 * @returns {*} Retourne le joueur gagnant.
 */
function checkWin(){
	// Récupère le nombre de lignes et de colonnes
	var maxRow =  GAME_GRID.rows.length;
	var maxCol =  GAME_GRID.rows[0].cells.length;

	// Parcours toutes les cellules de la grille.
	// Parcours les lignes.
	for (let r = 0; r < maxRow; r++){
		// Parcours les colonnes.
		for (let c = 0; c < maxCol; c++){

			// Récupère le joueur qui a joué la pièce.
			var player = GAME_GRID.rows[r].cells[c].firstElementChild.dataset.color;

			if (typeof player !== 'undefined'){

				// Détecte si un joueur a une ligne
				if (c + 3 < maxCol &&
					player === GAME_GRID.rows[r].cells[c+1].firstElementChild.dataset.color &&
					player === GAME_GRID.rows[r].cells[c+2].firstElementChild.dataset.color &&
					player === GAME_GRID.rows[r].cells[c+3].firstElementChild.dataset.color)
				{
					return player;
				}

				// Détecte si un joueur a une colonne
				if (r+3 < maxRow){

					// check colonne.
					if (player === GAME_GRID.rows[r+1].cells[c].firstElementChild.dataset.color &&
						player === GAME_GRID.rows[r+2].cells[c].firstElementChild.dataset.color &&
						player === GAME_GRID.rows[r+3].cells[c].firstElementChild.dataset.color)
					{
						return player;
					}

					// Détecte si un joueur a une diagonale descendante.
					if (c + 3 < maxCol &&
						player === GAME_GRID.rows[r+1].cells[c+1].firstElementChild.dataset.color &&
						player === GAME_GRID.rows[r+2].cells[c+2].firstElementChild.dataset.color &&
						player === GAME_GRID.rows[r+3].cells[c+3].firstElementChild.dataset.color)
					{
						return player;
					}

					// Détecte si un joueur a une diagonale ascendante.
					if ( c - 3 >= 0 &&
						player === GAME_GRID.rows[r+1].cells[c-1].firstElementChild.dataset.color &&
						player === GAME_GRID.rows[r+2].cells[c-2].firstElementChild.dataset.color &&
						player === GAME_GRID.rows[r+3].cells[c-3].firstElementChild.dataset.color)
					{
						return player;
					}
				}
			}
		}
	}
	return null;
}

/**
 * Réinitialise le jeu.
 */
function reset(){
	// Réinitialize le joueur courant.
	var currentPlayer = document.getElementById("CurrentPlayer");
	currentPlayer.innerHTML = "Rouge doit jouer !";
	currentPlayer.setAttribute('data-color', 'rouge');

	// Récupère le nombre de lignes et de colonnes de la grille.
	var maxRow =  GAME_GRID.rows.length;
	var maxCol =  GAME_GRID.rows[0].cells.length;

	// Parcours toutes les cellules.
	// Parcours les lignes.
	for (let r = 0; r < maxRow; r++){
		// Parcours les colonnes.
		for (let c = 0; c < maxCol; c++){

			// Réinisialise la grille de jeu.
			GAME_GRID.rows[r].cells[c].firstElementChild.removeAttribute('style');
			GAME_GRID.rows[r].cells[c].firstElementChild.removeAttribute('class');
			GAME_GRID.rows[r].cells[c].firstElementChild.removeAttribute('data-color');
		}
	}

	isGameOver = false;
	return;
}

