package backendmemory.play.controller;

import backendmemory.exceptions.InvalidMoveException;
import backendmemory.play.contract.*;
import backendmemory.play.domain.Game;
import backendmemory.exceptions.InvalidGameException;
import backendmemory.exceptions.InvalidParamException;
import backendmemory.exceptions.NotFoundException;
import backendmemory.play.domain.GameCard;
import backendmemory.play.service.GameService;
import backendmemory.record.domain.Cardset;
import backendmemory.record.service.CardsetService;
import backendmemory.utils.CardsetMapper;
import backendmemory.utils.GameMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600, methods = {RequestMethod.OPTIONS,
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE}, allowedHeaders = "*")
@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final CardsetService cardsetService;
    private final SimpMessagingTemplate simplMessagingTemplate;

    @GetMapping("/")
    public ResponseEntity<List<GameDto>> getAllGames() {
        log.info("get all games");
        List<Game> gameList = gameService.getAllGames();
        List<GameDto> gameDtoList = new ArrayList<>();
        gameList.forEach(item -> gameDtoList.add(GameMapper.mapGameToGameDto(item)));
        return ResponseEntity.ok(gameDtoList);
    }

    @PostMapping("/start")
    public ResponseEntity<GameDto> start(@RequestBody StartGameDto startGameDto) throws NotFoundException {
        Cardset cardset = cardsetService.getCardset(startGameDto.getCardsetId());
        List<GameCard> gameCards = CardsetMapper.mapCardsetToPlayCardList(cardset);
        log.info("start a new memory game: {}", startGameDto);
        Game game = gameService.createGame(
                startGameDto.getPlayer(),
                gameCards,
                cardset.getCardsetName(), cardset.getLanguage1() + " - " + cardset.getLanguage2());

        // update new game-list in the topic
        List<NewGameDto> listNewGames = gameService.getNewGames();
        simplMessagingTemplate.convertAndSend("/topic/new-games/", listNewGames);

        return ResponseEntity.ok(GameMapper.mapGameToGameDto(game));
    }

    @PostMapping("/join")
    public ResponseEntity<GameDto> join(@RequestBody JoinGameDto joinGameDto) throws NotFoundException {
        log.info("join a new memory game: {}", joinGameDto);
        Game game = gameService.joinGame(joinGameDto.getPlayer(), joinGameDto.getGameId());

        // write game to topic
        simplMessagingTemplate.convertAndSend(
                "/topic/game-progress/" + game.getGameId(),
                GameMapper.mapGameToGameDto(game)
        );

        // update new game-list in the topic
        List<NewGameDto> listNewGames = gameService.getNewGames();
        simplMessagingTemplate.convertAndSend("/topic/new-games/", listNewGames);

        return ResponseEntity.ok(GameMapper.mapGameToGameDto(game));
    }

    @PostMapping("/play")
    public ResponseEntity<GameDto> play(@RequestBody PlayGameDto request) throws NotFoundException, InvalidParamException, InvalidGameException, InvalidMoveException {
        log.info("turn memory card: {}", request);
        Game game = gameService.turnMemoryCard(request.getGameId(),
                GameMapper.mapPlayerTagDtoToPlayerTag(request.getTag()),
                request.getCardId());

        // write game to topic
        simplMessagingTemplate.convertAndSend(
                "/topic/game-progress/" + game.getGameId(),
                GameMapper.mapGameToGameDto(game)
        );

        log.info("apply game rules: {}", request);
        Game game2 = gameService.applyGameRules(request.getGameId());

        // write game2 to topic
        simplMessagingTemplate.convertAndSend(
                "/topic/game-progress/" + game.getGameId(),
                GameMapper.mapGameToGameDto(game2));

        return ResponseEntity.ok(GameMapper.mapGameToGameDto(game2));
    }

    @PostMapping("/end")
    public void end(@RequestBody String gameId) throws NotFoundException {
        String id = gameId.replace("\"", "");
        log.info("end memory game: {}", id);
        Game game = gameService.stopGame(id);

        // write game to topic
        simplMessagingTemplate.convertAndSend(
                "/topic/game-progress/" + game.getGameId(),
                GameMapper.mapGameToGameDto(game)
        );

        // update new game-list in the topic
        List<NewGameDto> listNewGames = gameService.getNewGames();
        simplMessagingTemplate.convertAndSend("/topic/new-games/", listNewGames);
    }

    @GetMapping("/new")
    public ResponseEntity<List<NewGameDto>> getNewGames(){
        log.info("get all new games");
        return ResponseEntity.ok(gameService.getNewGames());
    }

    @DeleteMapping("/")
    public void deleteGames() {
        log.info("delete all games in database");
        gameService.deleteGames();
    }
}
