package backendmemory.play.service;

import backendmemory.exceptions.InvalidMoveException;
import backendmemory.play.contract.NewGameDto;
import backendmemory.play.domain.GameCard;
import backendmemory.play.domain.Game;
import backendmemory.play.domain.GameState;
import backendmemory.exceptions.InvalidGameException;
import backendmemory.exceptions.InvalidParamException;
import backendmemory.exceptions.NotFoundException;
import backendmemory.play.domain.PlayerTag;
import backendmemory.play.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public Game createGame(String player1, List<GameCard> cardsetGameCards, String cardsetName, String languages) {
        Game game = new Game(cardsetGameCards, player1, cardsetName, languages);

        gameRepository.save(game);
        return game;
    }

    public Game joinGame(String player2, String gameId) throws NotFoundException {

        Game game = gameRepository.findAll().stream()
                .filter(g -> g.getGameState().equals(GameState.NEW) &&
                        g.getGameId().equals(gameId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Game not found"));
        game.setPlayer2(player2);
        game.setGameState(GameState.IN_PROGRESS);

        gameRepository.save(game);
        return game;
    }

    public Game turnMemoryCard(String gameId, PlayerTag playerTag, String cardId) throws NotFoundException, InvalidGameException, InvalidParamException, InvalidMoveException {
        Optional<Game> gameOptional = gameRepository.findById(gameId);
        if(gameOptional.isEmpty()) {
            throw new NotFoundException("Game not found");
        }
        Game game = gameOptional.get();
        if(game.getGameState().equals(GameState.FINISHED) || game.getGameState().equals(GameState.NEW)) {
            throw new InvalidGameException("Game is finished or new");
        }
        if(!game.isActivePlayer(playerTag)) {
            throw new InvalidMoveException("The inactive Player is not allowed to play");
        }
        game.turnCardTemporarily(cardId);
        gameRepository.save(game);
        return game;
    }

    @Override
    public Game stopGame(String gameId) throws NotFoundException {
        Optional<Game> gameOptional = gameRepository.findById(gameId);
        if (gameOptional.isEmpty()) {
            throw new NotFoundException("Game not found");
        }
        Game game = gameOptional.get();
        game.setGameState(GameState.STOPPED);
        gameRepository.save(game);
        return game;
    }

    @Override
    public Game applyGameRules(String gameId) throws NotFoundException, InvalidGameException {
        Optional<Game> gameOptional = gameRepository.findById(gameId);
        if(gameOptional.isEmpty()) {
            throw new NotFoundException("Game not found");
        }
        Game game = gameOptional.get();
        if(game.getGameState().equals(GameState.FINISHED)) {
            throw new InvalidGameException("Game is already finished");
        }
        game.applyGameRules();
        gameRepository.save(game);
        return game;
    }

    @Override
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Override
    public List<NewGameDto> getNewGames() {
        var allNewGames = gameRepository.findAll();
        ArrayList<NewGameDto> list = new ArrayList<>();
        allNewGames.forEach(newGame -> {
            if(newGame.getGameState() == GameState.NEW) {
                var tmp = new NewGameDto(
                        newGame.getPlayer1().getName(),
                        newGame.getGameId(),
                        newGame.getLanguages(),
                        newGame.getCardsetName()
                );
                list.add(tmp);
            }
        });
        return list;
    }

    @Override
    public void deleteGames() {
        gameRepository.deleteAll();
    }
}
