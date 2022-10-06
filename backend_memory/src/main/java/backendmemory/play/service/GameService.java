package backendmemory.play.service;

import backendmemory.exceptions.InvalidMoveException;
import backendmemory.play.contract.NewGameDto;
import backendmemory.play.domain.Game;
import backendmemory.exceptions.InvalidGameException;
import backendmemory.exceptions.InvalidParamException;
import backendmemory.exceptions.NotFoundException;
import backendmemory.play.domain.GameCard;
import backendmemory.play.domain.PlayerTag;

import java.util.List;

public interface GameService {
    Game createGame(String player1, List<GameCard> gameCards, String cardsetName, String languages);
    Game joinGame(String player2, String gameId) throws NotFoundException;
    Game turnMemoryCard(String gameId, PlayerTag playerTag, String cardId) throws NotFoundException, InvalidGameException, InvalidParamException, InvalidMoveException;
    Game stopGame(String gameId) throws NotFoundException;
    Game applyGameRules(String gameId) throws NotFoundException, InvalidGameException;
    List<Game> getAllGames();
    List<NewGameDto> getNewGames();
    void deleteGames();
}
