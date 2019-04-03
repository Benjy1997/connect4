// Initializing a class definition
class AI {
    endGame = false;

    constructor(depth) {
        this.depth = depth;
    }

    play(player){
        let colPlayed;
        let gameBoard = this.boardToArray();
        let moves = this.getMoves(gameBoard);
        let bestScore;
        let score;

        // initialise le meilleur score.
        bestScore = this.singleMoveScore(gameBoard, moves[0], player, player, this.depth); // Calcul le score du premier coup.
        colPlayed = moves[0][1]; // Retourne la colonne ([1]) du premier coup ([0]).

        // Parcours les coup possibles
        // i = 1 car le score du premier coup a déjà été effectué.
        for (let i = 1; i < moves.length; i++){

            score = this.singleMoveScore(gameBoard, moves[i], player, player, this.depth);

            // Si le score du coup actuel est plus grand que le meilleur score.
            if (score > bestScore){
                colPlayed = moves[i][1];
                bestScore = score;
            }
        }

        return colPlayed;
    }

    /**
     * Génère les coups.
     * Un coup possible est composé d'un tableau contenant les coordonnées du coup.
     * Index 0 : la ligne.
     * Index 1 : la colonne.
     * @param gameBoard la grille de jeu
     * @returns {Array} Un tableau des coups possibles.
     */
    getMoves(gameBoard){
        let moves = [];

        // Parcours toutes les colonnes de la grille de jeu.
        for (let i = 0; i < gameBoard[0].length; i++){
            // Si la colonne n'est pas remplie
            if (gameBoard[0][i] == 0){
                let col = i;
                let row = this.getLastPlayableRow(gameBoard, col);
                let move = [row,col];
                moves.push(move);
            }
        }
        return moves;
    }

    /**
     * Récupère l'indice de la ligne de la grille de jeu ou la pièce tombera.
     * @param gameBoard La grille de jeu.
     * @param col La colonne ou la pièce sera déposée.
     * @returns {number} La ligne ou la pièce tombera.
     */
    getLastPlayableRow(gameBoard, col){

        // Parcours les lignes de la colonne en commençant par la dernière.
        for (let i = gameBoard.length-1; i >= 0; i--){
            if (gameBoard[i][col] == 0)
                return i;
        }
    }

    /**
     * Transforme la grille de jeu html en tableau JS.
     * Valeur attrubuer dans le tableau :
     * 1 --> joueur rouge,
     * 2 --> joueur jaune,
     * 0 --> aucun joueur.
     * @returns {gameBoard[]} Le tableau js de la grille de jeu html.
     */
    boardToArray(){

        let htmlGrid = document.getElementById("tableId"); // Grille de jeu html.
        let nbRow = htmlGrid.rows.length;
        let nbCol = htmlGrid.rows[0].cells.length;

        let gameBoard = new Array(nbRow);

        // Parcours le tableau HTML.
        // Parcours les lignes.
        for (let iRow = 0; iRow < nbRow; iRow++){
            // Parcours les colonnes;
            let row = new Array(nbCol);
            for (let iCol = 0; iCol < nbCol; iCol++){
                let player = htmlGrid.rows[iRow].cells[iCol].firstElementChild.dataset.color;
                switch (player) {
                    case 'rouge':
                        row[iCol] = 1;
                        break;
                    case 'jaune':
                        row[iCol] = 2;
                        break;
                    default:
                        row[iCol] = 0;
                }
                gameBoard[iRow] = row;
            }
        }
        return gameBoard;
    }

    /**
     * Change le joueur courant.
     * @param currentPlayer
     * @returns {number}
     */
    changePlayer(currentPlayer){
        if (currentPlayer == 1)
            currentPlayer = 2;
        else
            currentPlayer = 1;

        return currentPlayer;
    }

    /**
     * Calcule le score d'un coup
     * @param gameBoard
     * @param move
     * @param refPlayer
     * @param currentPlayer
     * @param depth
     * @returns {int} // Score.
     */
    singleMoveScore(gameBoard, move, refPlayer, currentPlayer, depth){

        // Joue un coup
        gameBoard[move[0]][move[1]] = currentPlayer; // Joue un coup. [0] = id ligne [1] = id colonne.

        // Si le plateau de jeu est plein ou que c'est un coup gagnant ou qu'aucun nouveau coup ne dois être simulé
        if (this.isBoardFull(gameBoard) || this.winner(gameBoard, move) || depth === 0){
            return this.evalMove(gameBoard, refPlayer);
        } else {

            return this.minMax(gameBoard, refPlayer, this.changePlayer(currentPlayer), depth-1);
        }
    }

    /**
     * Maximise ou minimise le score selon le joueur de référence.
     * @param gameBoard
     * @param refPlayer
     * @param currentPlayer
     * @param depth
     * @returns {int} Un score
     */
    minMax(gameBoard, refPlayer, currentPlayer, depth){

        let moves = this.getMoves(gameBoard);
        let result = this.singleMoveScore(gameBoard,moves[0],refPlayer,currentPlayer,depth);
        let score = 0;
        for (let i = 1; i < moves.length; i++){
            score = this.singleMoveScore(gameBoard, moves[i],refPlayer,currentPlayer,depth);
            if (currentPlayer == refPlayer){
                result = this.max(result,score);
            } else {
                result = this.min(result,score);
            }
        }
        return result;
    }

    /**
     * Retourne le score minimal
     * @param result
     * @param score
     * @returns {int}
     */
    min(result, score){
        if(result < score)
            return score;
        else
            return result;
    }

    /**
     * retourne le score maximal
     * @param result
     * @param score
     * @returns {int}
     */
    max(result, score){
        if(score > result)
            return score;
        else
            return result;
    }

    /**
     * Contrôle si la grille de jeu n'est pas remplie totalement.
     * @param gameBoard
     * @returns {boolean}
     */
    isBoardFull(gameBoard){
        for (let i = 0; i < gameBoard[0].length; i++){
            if (gameBoard[0][i] == 0)
                return false;
        }

        return true;
    }


    evalMove(gameBoard, refPlayer){
        return this.calculScore(gameBoard, refPlayer) - this.calculScore(gameBoard,this.changePlayer(refPlayer));
    }

    calculScore(gameBoard, refPlayer){
        let result = 0;

        // Parcours toutes la grille de jeu.
        // Parcours les lignes.
        for (let i = 0; i < gameBoard.length; i++){
            //Parcours les colonnes.
            for(let j = 0; j < gameBoard[0].length; j++){
                if (gameBoard[i][j] == refPlayer){
                    result += this.scoreAlignment(this.nbTokensVerticallyAligned(gameBoard,i,j,refPlayer));
                    result += this.scoreAlignment(this.nbTokenshorizontallyAligned(gameBoard,i,j,refPlayer));
                    result += this.scoreAlignment(this.nbTokensDiagonallyASC(gameBoard,i,j,refPlayer));
                    result += this.scoreAlignment(this.nbTokensDiagonallyDESC(gameBoard,i,j,refPlayer));
                }
            }
        }
        return result;
    }

    nbTokensVerticallyAligned(gameBoard, row, col, refPlayer){
        let counter = 1;
        if(row+1 < gameBoard.length){
            if (gameBoard[row+1][col] == refPlayer)
                counter++;
        }

        if(row+2 < gameBoard.length){

            if (gameBoard[row+2][col] == refPlayer)
                counter++;
        }
        if(row+3 < gameBoard.length){
            if (gameBoard[row+3][col] == refPlayer)
                counter++;
        }
        return counter;
    }
    nbTokenshorizontallyAligned(gameBoard, row, col, refPlayer){
        let counter = 1;
        if(col+1 < gameBoard[0].length){
            if (gameBoard[row][col+1] == refPlayer)
                counter++;
        }

        if(col+2 < gameBoard[0].length){
            if (gameBoard[row][col+2] == refPlayer)
                counter++;
        }
        if(col+3 < gameBoard[0].length){
            if (gameBoard[row][col+3] == refPlayer)
                counter++;
        }
        return counter;
    }
    nbTokensDiagonallyASC(gameBoard, row, col, refPlayer){
        let counter = 1;
        if(row+1 < gameBoard.length && col-1 >= 0){
            if(gameBoard[row+1][col-1] == refPlayer)
                counter++;
        }

        if(row+2 < gameBoard.length && col-2 >= 0){
            if(gameBoard[row+2][col-2] == refPlayer)
                counter++;
        }
        if(row+3 < gameBoard.length && col-3 >= 0){
            if(gameBoard[row+3][col-3] == refPlayer)
                counter++;
        }
        return counter;
    }
    nbTokensDiagonallyDESC(gameBoard, row, col, refPlayer){
        let counter = 1;
        if(row+1 < gameBoard.length && col+1 < gameBoard[0].length){
            if (gameBoard[row+1][col+1] == refPlayer)
            counter++;
        }

        if(row+2 < gameBoard.length && col+2 < gameBoard[0].length){
            if(gameBoard[row+2][col+2] == refPlayer)
                counter++;
        }

        if(row+3 < gameBoard.length && col+3 < gameBoard[0].length){
            if(gameBoard[row+3][col+3] == refPlayer)
                counter++;
        }
        return counter;
    }

    scoreAlignment(nbTokensAligned){
        switch (nbTokensAligned) {
            case 1:
                return 1;
            case 2:
                return 5;
            case 3:
                return 50;
            case 4:
                return 1000;
        }
    }

    winner(gameBoard, move){
        return false;
    }
}