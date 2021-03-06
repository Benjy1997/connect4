/**
 * Représente l'IA du jeu basé sur l'algorithme MinMax.
 */
class AI {

    /**
     * Constructeur de la classe
     * @param depth Représente le nombre de coup en avance que jouera l'IA.
     */
    constructor(depth) {
        this.depth = depth;
    }

    /**
     * Fait jouer l'IA
     * @param {int} player La couleur du jeton que l'IA doit jouer. 1 = rouge 2 = jaune.
     * @returns {int} La colonne que l'IA jouera.
     */
    play(player){
        let colPlayed;
        let gameBoard = this.boardToArray();
        let copyGameBoard = $.extend(true,[],gameBoard);
        let moves = this.getMoves(gameBoard);
        let copyMoves = $.extend(true,[],moves);
        let bestScore;
        let score;

        // initialise le meilleur score.
        bestScore = this.singleMoveScore(copyGameBoard, copyMoves[0], player, player, this.depth); // Calcul le score du premier coup.
        colPlayed = moves[0][1]; // Retourne la colonne ([1]) du premier coup ([0]).
        copyMoves = $.extend(true,[],moves);
        // Parcours les coup possibles
        // i = 1 car le score du premier coup a déjà été effectué.
        for (let i = 1; i < moves.length; i++){
            copyGameBoard = $.extend(true,[],gameBoard);
            copyMoves = $.extend(true,[],moves);
            score = this.singleMoveScore(copyGameBoard, copyMoves[i], player, player, this.depth);
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
            if (gameBoard[0][i] === 0){
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
            if (gameBoard[i][col] === 0)
                return i;
        }
    }

    /**
     * Transforme la grille de jeu html en tableau JS.
     * Valeur attrubuer dans le tableau :
     * 1 --> joueur rouge,
     * 2 --> joueur jaune,
     * 0 --> aucun joueur.
     * @returns {Array} Le tableau js de la grille de jeu html.
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
     * @returns {int}
     */
    changePlayer(currentPlayer){
        if (currentPlayer === 1)
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
        let copyGameBoard = $.extend(true,[],gameBoard);

        // Si le plateau de jeu est plein ou que c'est un coup gagnant ou qu'aucun nouveau coup ne dois être simulé
        if (this.isBoardFull(gameBoard) || this.winner(gameBoard, move, currentPlayer) || depth === 0){
            return this.evalMove(copyGameBoard, refPlayer);
        } else {

            return this.minMax(copyGameBoard, refPlayer, this.changePlayer(currentPlayer), depth-1);
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
        let copyGameBoard = $.extend(true,[],gameBoard);
        let moves = this.getMoves(gameBoard);
        let copyMoves = $.extend(true,[],moves);
        let result = this.singleMoveScore(copyGameBoard,copyMoves[0],refPlayer,currentPlayer,depth);
        copyMoves = $.extend(true,[],moves);
        let score = 0;
        for (let i = 1; i < moves.length; i++){
            copyMoves = $.extend(true,[],moves);
            copyGameBoard = $.extend(true,[],gameBoard);
            score = this.singleMoveScore(copyGameBoard, copyMoves[i],refPlayer,currentPlayer,depth);
            if (currentPlayer === refPlayer){
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
        if(score < result)
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
            if (gameBoard[0][i] === 0)
                return false;
        }

        return true;
    }


    evalMove(gameBoard, refPlayer){
        let score1 = this.calculScore(gameBoard, refPlayer);
        let score2 = this.calculScore(gameBoard,this.changePlayer(refPlayer));
        return  score1-score2;
    }

    calculScore(gameBoard, refPlayer){
        let result = 0;

        // Parcours toutes la grille de jeu.
        // Parcours les lignes.
        for (let i = 0; i < gameBoard.length; i++){
            //Parcours les colonnes.
            for(let j = 0; j < gameBoard[0].length; j++){
                if (gameBoard[i][j] === refPlayer){
                    result += this.scoreAlignment(this.nbTokensVerticallyAligned(gameBoard,i,j));
                    result += this.scoreAlignment(this.nbTokenshorizontallyAligned(gameBoard,i,j));
                    result += this.scoreAlignment(this.nbTokensDiagonallyASC(gameBoard,i,j));
                    result += this.scoreAlignment(this.nbTokensDiagonallyDESC(gameBoard,i,j));
                }
            }
        }
        return result;
    }

    nbTokensVerticallyAligned(gameBoard, row, col){
        let counter = 1;
        let refPlayer = gameBoard[row][col];
        if(row+1 < gameBoard.length){
            if (gameBoard[row+1][col] === refPlayer)
                counter++;
            else
                return counter;
        }

        if(row+2 < gameBoard.length){

            if (gameBoard[row+2][col] === refPlayer)
                counter++;
            else
                return counter;
        }

        if(row+3 < gameBoard.length){
            if (gameBoard[row+3][col] === refPlayer)
                counter++;
            else
                return counter;
        }
        return counter;
    }

    nbTokenshorizontallyAligned(gameBoard, row, col){
        let counter = 1;
        let refPlayer = gameBoard[row][col];
        if(col+1 < gameBoard[0].length){
            if (gameBoard[row][col+1] === refPlayer)
                counter++;
            else
                return counter;
        }

        if(col+2 < gameBoard[0].length){
            if (gameBoard[row][col+2] === refPlayer)
                counter++;
            else
                return counter;
        }
        if(col+3 < gameBoard[0].length){
            if (gameBoard[row][col+3] === refPlayer)
                counter++;
            else
                return counter;
        }
        return counter;
    }

    nbTokensDiagonallyASC(gameBoard, row, col){
        let counter = 1;
        let refPlayer = gameBoard[row][col];
        if(row+1 < gameBoard.length && col-1 >= 0){
            if(gameBoard[row+1][col-1] === refPlayer)
                counter++;
            else
                return counter;
        }

        if(row+2 < gameBoard.length && col-2 >= 0){
            if(gameBoard[row+2][col-2] === refPlayer)
                counter++;
            else
                return counter;
        }
        if(row+3 < gameBoard.length && col-3 >= 0){
            if(gameBoard[row+3][col-3] === refPlayer)
                counter++;
            else
                return counter;
        }
        return counter;
    }

    nbTokensDiagonallyDESC(gameBoard, row, col){
        let counter = 1;
        let refPlayer = gameBoard[row][col];
        if(row+1 < gameBoard.length && col+1 < gameBoard[0].length){
            if (gameBoard[row+1][col+1] === refPlayer)
            counter++;
            else
                return counter;
        }

        if(row+2 < gameBoard.length && col+2 < gameBoard[0].length){
            if(gameBoard[row+2][col+2] === refPlayer)
                counter++;
            else
                return counter;
        }

        if(row+3 < gameBoard.length && col+3 < gameBoard[0].length){
            if(gameBoard[row+3][col+3] === refPlayer)
                counter++;
            else
                return counter;
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

    winner(gameBoard, move, player){
        //return false;
        let row = move[0];
        let col = move[1];
        let counter = 1;


        // Check ligne.
        for (let i = 1; i <= 3; i++ ){

            if (row-i >= 0){
                if(gameBoard[row-i][col] == player)
                    counter++;
                else
                    i = 4
            }

        }
        for (let i = 1; i <= 3; i++ ){

            if (row+i < gameBoard.length){
                if (gameBoard[row+i][col] == player)
                    counter++
                else
                    i = 4
            }
        }

        if (counter >= 4)
            return true;

        counter = 1;

        // check colonne
        for (let i = 1; i <= 3; i++ ){

            if (col-i >= 0){
                if(gameBoard[row][col-i] == player)
                    counter++;
                else
                    i = 4
            }

        }
        for (let i = 1; i <= 3; i++ ){

            if (col+i < gameBoard[0].length){
                if (gameBoard[row][col+i] == player)
                    counter++
                else
                    i = 4
            }
        }
        if (counter >= 4)
            return true;

        counter = 1;

        // check diag asc.
        for (let i = 1; i <= 3; i++ ){

            if (row-i >= 0 && col+i < gameBoard[0].length){
                if(gameBoard[row-i][col+i] == player)
                    counter++;
                else
                    i = 4
            }
        }
        for (let i = 1; i <= 3; i++ ){

            if (col-i >= 0 && row+i < gameBoard.length){
                if (gameBoard[row+i][col-i] == player)
                    counter++
                else
                    i = 4
            }
        }
        if (counter >= 4)
            return true;

        counter = 1;
        // check diag desc
        for (let i = 1; i <= 3; i++ ){

            if (row+i < gameBoard.length && col+i < gameBoard[0].length ){
                if (gameBoard[row+i][col+i] == player)
                    counter++
                else
                    i = 4
            }
        }

        for (let i = 1; i <= 3; i++ ){

            if (row-i >= 0 && col-i >= 0 ){
                if (gameBoard[row-i][col-i] == player)
                    counter++
                else
                    i = 4
            }
        }
        if (counter >= 4)
            return true;
        return false;
    }

    test(){
        let gameBoard = this.boardToArray();
        let copyTab = $.extend(true,[],gameBoard);
        this.test2(copyTab);
        copyTab = $.extend(true,[],gameBoard);
    }

    test2(tab){
        tab[5][1] = 2;
    }
}