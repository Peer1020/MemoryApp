package backendmemory.play.service;

import backendmemory.exceptions.InvalidMoveException;
import backendmemory.play.contract.PlayGameDto;
import backendmemory.play.contract.PlayerTagDto;
import backendmemory.play.domain.*;
import backendmemory.exceptions.InvalidGameException;
import backendmemory.exceptions.InvalidParamException;
import backendmemory.exceptions.NotFoundException;
import backendmemory.play.repository.GameRepository;
import backendmemory.utils.GameMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Unit Test GameService")
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameServiceImpl gameService;

    List<GameCard> cards1;
    List<GameCard> cards2;
    List<GameCard> cards3;
    Game game1;
    Game game2;
    Game game3;

    @BeforeEach
    void setUp() {
        cards1 = new ArrayList<>();
        cards1.add(GameCard.builder()
                .cardId("1").word("Haus").connectId("1")
                .switched(false).build());
        cards1.add(GameCard.builder()
                .cardId("2").word("Auto").connectId("2")
                .switched(false).build());
        cards1.add(GameCard.builder()
                .cardId("3").word("House").connectId("1")
                .switched(false).build());
        cards1.add(GameCard.builder()
                .cardId("4").word("Car").connectId("2")
                .switched(false).build());
        cards2 = new ArrayList<>();
        cards2.add(GameCard.builder()
                .cardId("1").word("Haus").connectId("1")
                .switched(false).build());
        cards2.add(GameCard.builder()
                .cardId("2").word("Auto").connectId("2")
                .switched(false).build());
        cards2.add(GameCard.builder()
                .cardId("3").word("House").connectId("1")
                .switched(false).build());
        cards2.add(GameCard.builder()
                .cardId("4").word("Car").connectId("2")
                .switched(false).build());
        cards3 = new ArrayList<>();
        cards3.add(GameCard.builder()
                .cardId("1").word("Haus").connectId("1")
                .switched(true).build());
        cards3.add(GameCard.builder()
               .cardId("2").word("Auto").connectId("2")
               .switched(true).build());
        cards3.add(GameCard.builder()
               .cardId("3").word("House").connectId("1")
               .switched(true).build());
        cards3.add(GameCard.builder()
                .cardId("4").word("Car").connectId("2")
                .switched(true).build());
        game1 = new Game(cards1, "Laura", "setName", "de- en");
        game1.setGameId("1");
        game2 = new Game(cards2, "Laura", "setName", "de- en");
        game2.setGameId("2");
        game2.setPlayer2("Karin");
        game3 = new Game(cards3, "Laura", "setName", "de- en");
        game3.setPlayer2("Karin");
        game3.setGameId("3");
        game3.setGameState(GameState.FINISHED);
    }

    @DisplayName("first player creates the game")
    @Test
    void createGameTest() {

        // act
        Game gameFromService = gameService.createGame("Lena", cards1, "setName", "de- en");

        // assert
        assertThat(gameFromService).isNotNull();
        assertThat(gameFromService.getPlayer1().toString()).isEqualTo("Lena");
        assertThat(gameFromService.getPlayer2()).isNull();
        assertThat(gameFromService.getGameState()).isEqualTo(GameState.NEW);
        assertThat(gameFromService.getGameId()).isNotNull();
        assertThat(gameFromService.getMemoryBoard()).isInstanceOf(MemoryBoard.class).isNotNull();
    }

    @DisplayName("second player joins the game")
    @Test
    void joinGameTest() throws NotFoundException {

        // arrange
        when(gameRepository.findAll()).thenReturn(List.of(game1, game2));

        // act
        Game joinedGame = gameService.joinGame("Lisa", "1");

        // assert
        assertThat(joinedGame).isNotNull();
        assertThat(joinedGame.getPlayer1().toString()).isEqualTo("Laura");
        assertThat(joinedGame.getPlayer2().toString()).isEqualTo("Lisa");
        assertThat(joinedGame.getGameState()).isEqualTo(GameState.IN_PROGRESS);
        assertThat(joinedGame.getGameId()).isEqualTo("1");
        assertThat(joinedGame.getMemoryBoard()).isInstanceOf(MemoryBoard.class).isNotNull();
    }

    @DisplayName("exception thrown, if second player joins a non existing game")
    @Test
    void joinGameNotFoundTest() {

        // arrange
        when(gameRepository.findAll()).thenReturn(new ArrayList<>());

        // act & assert
        assertThatThrownBy(() -> gameService.joinGame("Mike", "23"))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not found");
    }

    @DisplayName("execute turn next memory card")
    @Test
    void turnNextMemoryCardTest() throws InvalidParamException, InvalidGameException, NotFoundException, InvalidMoveException {

        // arrange
        game2.setGameState(GameState.IN_PROGRESS);
        when(gameRepository.findById("2")).thenReturn(Optional.of(game2));
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("2").cardId("2").tag(PlayerTagDto.ONE)
                .build();

        // act
        gameService.turnMemoryCard(playGameDto.getGameId(),
                GameMapper.mapPlayerTagDtoToPlayerTag(playGameDto.getTag()), playGameDto.getCardId());

        // & assert
        assertThat(cards2.get(Integer.parseInt(playGameDto.getCardId())-1).isTemporarilySwitched()).isTrue();
    }

    @DisplayName("execute apply game rules")
    @Test
    void applyGameRulesTest() throws InvalidGameException, NotFoundException {

        // arrange
        cards2.get(0).setTemporarilySwitched(true);
        cards2.get(2).setTemporarilySwitched(true);
        when(gameRepository.findById("2")).thenReturn(Optional.of(game2));
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("2").cardId("2").tag(PlayerTagDto.ONE)
                .build();

        // act
        gameService.applyGameRules(playGameDto.getGameId());

        // & assert
        assertThat(cards2.get(0).isTemporarilySwitched()).isFalse();
        assertThat(cards2.get(2).isTemporarilySwitched()).isFalse();
        assertThat(cards2.get(0).isSwitched()).isTrue();
        assertThat(cards2.get(2).isSwitched()).isTrue();
    }

    @DisplayName("exception thrown, if played game does not exist")
    @Test
    void playWithWrongGameIdTest() {

        // arrange
        when(gameRepository.findById("3")).thenReturn(Optional.empty());
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("3").cardId("2").tag(PlayerTagDto.ONE).build();

        // act & assert
        assertThatThrownBy(() -> gameService.turnMemoryCard(playGameDto.getGameId(),
                        GameMapper.mapPlayerTagDtoToPlayerTag(playGameDto.getTag()), playGameDto.getCardId()))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not found");
        assertThatThrownBy(() -> gameService.applyGameRules(playGameDto.getGameId()))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not found");
    }

    @DisplayName("exception thrown, if played game is already finished")
    @Test
    void playWithFinishedGameTest() {

        // arrange
        when(gameRepository.findById("3")).thenReturn(Optional.of(game3));
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("3").cardId("2").tag(PlayerTagDto.ONE).build();

        // act & assert
        assertThatThrownBy(() -> gameService.turnMemoryCard(playGameDto.getGameId(),
                GameMapper.mapPlayerTagDtoToPlayerTag(playGameDto.getTag()), playGameDto.getCardId()))
                .isInstanceOf(InvalidGameException.class)
                .hasMessage("Game is finished or new");
        assertThatThrownBy(() -> gameService.applyGameRules(playGameDto.getGameId()))
                .isInstanceOf(InvalidGameException.class)
                .hasMessage("Game is already finished");
    }

    @DisplayName("the game is stopped properly")
    @Test
    void stopGameTest() throws NotFoundException {
        // arrange
        game1.setGameState(GameState.NEW);
        when(gameRepository.findById("1")).thenReturn(Optional.of(game1));

        // act
        gameService.stopGame("1");

        // assert
        assertThat(game1.getGameState()).isEqualTo(GameState.STOPPED);
    }

    @DisplayName("exception thrown, if stopped game does not exist")
    @Test
    void stopNotExistingGameTest() {

        // arrange
        when(gameRepository.findById("1")).thenReturn(Optional.empty());

        // act & assert
        assertThatThrownBy(() -> gameService.stopGame("1"))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not found");
    }
}
