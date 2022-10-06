package backendmemory.play.domain;

import backendmemory.exceptions.InvalidParamException;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {
    @Getter
    @Setter
    private @Id String gameId;

    @Setter
    private MemoryBoard memoryBoard;

    @Setter
    private Player player1;

    private Player player2;

    @Getter
    @Setter
    private GameState gameState;

    @Setter
    private Player activePlayer;

    @Getter
    @Setter
    private String cardsetName;

    @Getter
    @Setter
    private String languages;

    public Game(List<GameCard> cardsetGameCards, String player1, String cardsetName, String languages) {
        this.gameId = UUID.randomUUID().toString();
        this.memoryBoard = new MemoryBoard(cardsetGameCards);
        this.player1 = new Player(PlayerTag.ONE, player1);
        this.gameState = GameState.NEW;
        this.activePlayer = this.player1;
        this.cardsetName = cardsetName;
        this.languages = languages;
    }

    public Player getPlayer1() {
        return (Player) this.player1.clone();
    }

    public Player getPlayer2() {
        return this.player2 != null ? (Player) this.player2.clone() : null;
    }

    public MemoryBoard getMemoryBoard() {
        return (MemoryBoard) this.memoryBoard.clone();
    }

    public Player getActivePlayer() {
        return (Player) this.activePlayer.clone();
    }

    public void turnCard(String cardId) throws InvalidParamException {
        this.memoryBoard.turnCard(cardId);
    }

    public void setPlayer2(String player2) {
        this.player2 = new Player(PlayerTag.TWO, player2);
    }

    public void turnCardTemporarily(String cardId) throws InvalidParamException {
        this.memoryBoard.turnCardTemporarily(cardId);
    }

    public boolean isActivePlayer(PlayerTag playerToCheck) {
        return playerToCheck == activePlayer.getTag();
    }

    public void applyGameRules() {

        if(memoryBoard.areTwoCardsTurnedTemp()) {

            if(memoryBoard.turnMatchingCardsPermanently()) {
                if(this.activePlayer.getTag() == this.player1.getTag()) {
                    this.player1.incrementPairs();
                } else {
                    this.player2.incrementPairs();
                }
            } else {
                this.activePlayer =
                        this.activePlayer.getTag() == this.player1.getTag()
                                ? this.player2
                                : this.player1;
            }
        }

        if(memoryBoard.areAllCardsTurned()) {
            this.setGameState(GameState.FINISHED);
        }
    }

    @Override
    public Object clone() {
        Game game;
        try {
            game = (Game) super.clone();
        } catch (CloneNotSupportedException e) {
            game = new Game(this.getGameId(),
                    this.getMemoryBoard(),
                    this.getPlayer1(),
                    this.getPlayer2(),
                    this.getGameState(),
                    this.getActivePlayer(),
                    this.getCardsetName(),
                    this.getLanguages()
            );
        }
        game.player1 = (Player) this.player1.clone();
        game.player2 = (Player) this.player2.clone();
        game.activePlayer = (Player) this.activePlayer.clone();
        game.memoryBoard = (MemoryBoard) this.memoryBoard.clone();
        return game;
    }
}
