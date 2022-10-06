package backendmemory.utils;

import backendmemory.play.contract.*;
import backendmemory.play.domain.*;

import java.util.ArrayList;
import java.util.List;

public class GameMapper {
    public static GameDto mapGameToGameDto(Game game) {
        GameDto gameDto = new GameDto(
                game.getGameId(),
                mapMemoryBoardToMemoryBoardDto(game.getMemoryBoard()),
                mapPlayerToPlayerDto(game.getPlayer1()),
                game.getPlayer2() != null ? mapPlayerToPlayerDto(game.getPlayer2()) : null,
                mapGameStateToGameStateDto(game.getGameState()),
                mapPlayerToPlayerDto(game.getActivePlayer()),
                game.getCardsetName(),
                game.getLanguages());
        gameDto.getMemoryBoard().getGameCards().forEach(card -> {
            if (!card.isTemporarilySwitched() && !card.isSwitched()) {
                card.setWord(null);
            }
        });
        return gameDto;
    }

    private static PlayerDto mapPlayerToPlayerDto(Player player) {
        return new PlayerDto(
                player.getTag().name().equals(PlayerTagDto.ONE.toString()) ? PlayerTagDto.ONE : PlayerTagDto.TWO,
                player.getName(),
                player.getPairs()
        );
    }

    public static PlayerTag mapPlayerTagDtoToPlayerTag (PlayerTagDto playerTagDto) {
        return playerTagDto.name().equals(PlayerTag.ONE.name())
                ? PlayerTag.ONE : PlayerTag.TWO;
    }

    private static GameStateDto mapGameStateToGameStateDto(GameState gameState) {
        if (gameState.name().equals(GameState.NEW.name())) {
            return GameStateDto.NEW;
        } else if (gameState.name().equals(GameState.IN_PROGRESS.name())) {
            return GameStateDto.IN_PROGRESS;
        } else if (gameState.name().equals(GameState.FINISHED.name())) {
            return GameStateDto.FINISHED;
        } else {
            return GameStateDto.STOPPED;
        }
    }

    private static MemoryBoardDto mapMemoryBoardToMemoryBoardDto(MemoryBoard memoryBoard) {
        List<GameCardDto> list = new ArrayList<>();
        memoryBoard.getGameCards().forEach(card -> {
            GameCardDto gameCardDto = mapGameCardToGameCardDto(card);
            if (!gameCardDto.isTemporarilySwitched() && !gameCardDto.isSwitched()) {
                card.setWord(null);
            }
            list.add(gameCardDto);
        });
        return new MemoryBoardDto(list);
    }

    private static GameCardDto mapGameCardToGameCardDto(GameCard gameCard) {
        return new GameCardDto(
                gameCard.getCardId(),
                gameCard.getConnectId(),
                gameCard.getWord(),
                gameCard.isSwitched(),
                gameCard.isTemporarilySwitched()
        );
    }
}
