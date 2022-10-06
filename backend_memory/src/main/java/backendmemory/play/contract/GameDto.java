package backendmemory.play.contract;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameDto {
    private String gameId;
    private MemoryBoardDto memoryBoard;
    private PlayerDto player1;
    private PlayerDto player2;
    private GameStateDto gameState;
    private PlayerDto activePlayer;
    private String cardsetName;
    private String languages;
}
