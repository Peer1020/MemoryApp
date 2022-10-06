package backendmemory.play.controller;

import backendmemory.play.contract.JoinGameDto;
import backendmemory.play.contract.PlayGameDto;
import backendmemory.play.contract.PlayerTagDto;
import backendmemory.play.contract.StartGameDto;
import backendmemory.play.domain.GameCard;
import backendmemory.play.domain.Game;
import backendmemory.play.domain.GameState;
import backendmemory.exceptions.InvalidGameException;
import backendmemory.exceptions.InvalidParamException;
import backendmemory.exceptions.NotFoundException;
import backendmemory.play.domain.PlayerTag;
import backendmemory.record.domain.Cardset;
import backendmemory.record.service.CardsetService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import backendmemory.play.service.GameServiceImpl;
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;
import java.util.List;


@DisplayName("Unit Test GameController")
@WebMvcTest(controllers = GameController.class)
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GameServiceImpl gameService;

    @MockBean
    private CardsetService cardsetService;

    @MockBean
    private SimpMessagingTemplate simplMessagingTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private List<GameCard> gameCards = new ArrayList<>();
    private Game game;

    @BeforeEach
    void setUp() {
        gameCards.add(GameCard.builder()
                .cardId("1").word("Haus").connectId("1")
                .switched(false).build());
        gameCards.add(GameCard.builder()
                .cardId("2").word("Auto").connectId("2")
                .switched(false).build());
        gameCards.add(GameCard.builder()
                .cardId("3").word("House").connectId("1")
                .switched(false).build());
        gameCards.add(GameCard.builder()
                .cardId("4").word("Car").connectId("2")
                .switched(false).build());
        game = new Game(gameCards, "Jana", "setName", "de- en");
    }

    @DisplayName("/game/: verify correctness of response")
    @Test
    void getAllGamesTest() throws Exception {

        // arrange
        ArrayList<Game> list = new ArrayList<>();
        list.add(game);
        given(gameService.getAllGames()).willReturn(list);

        // act
        ResultActions response = mockMvc.perform(get("/game/"));

        // assert
        response.andExpectAll(
                status().isOk(),
                content().contentType(MediaType.APPLICATION_JSON),
                jsonPath("$").isArray()
        );
    }

    @DisplayName("/game/start: verify correctness of response")
    @Test
    void startTest() throws Exception {

        // arrange
        StartGameDto startGameDto = new StartGameDto("Jana", "3");
        Cardset cardset = new Cardset("", "", "", new ArrayList<>());
        given(gameService.createGame(anyString(), anyList(), anyString(), anyString()))
                .willReturn(game);
        given(cardsetService.getCardset(anyString()))
                .willReturn(cardset);

        // act
        ResultActions response = mockMvc.perform(post("/game/start")
                .content(objectMapper.writeValueAsString(startGameDto))
                .contentType(MediaType.APPLICATION_JSON));

        // assert
        response.andExpectAll(
                status().isOk(),
                content().contentType(MediaType.APPLICATION_JSON),
                jsonPath("$.player1.tag").value("ONE"),
                jsonPath("$.player1.name").value("Jana"),
                jsonPath("$.player2").isEmpty(),
                jsonPath("$.gameState").value(GameState.NEW.toString()),
                jsonPath("$.memoryBoard").isNotEmpty()
        );
    }


    @DisplayName("/game/join: verify correctness of response")
    @Test
    void joinTest() throws Exception {

        // arrange
        game.setPlayer2("Laura");
        game.setGameState(GameState.IN_PROGRESS);
        given(gameService.joinGame(anyString(), anyString())).willReturn(game);
        JoinGameDto joinGameDto = new JoinGameDto("Laura", "1");

        // act
        ResultActions response = mockMvc.perform(post("/game/join")
                .content(objectMapper.writeValueAsString(joinGameDto))
                .contentType(MediaType.APPLICATION_JSON));

        // assert
        response.andExpectAll(
                status().isOk(),
                content().contentType(MediaType.APPLICATION_JSON),
                jsonPath("$.player1.tag").value("ONE"),
                jsonPath("$.player1.name").value("Jana"),
                jsonPath("$.player2.tag").value("TWO"),
                jsonPath("$.player2.name").value("Laura"),
                jsonPath("$.gameState").value(GameState.IN_PROGRESS.toString()),
                jsonPath("$.memoryBoard").isNotEmpty()
        );
    }

    @DisplayName("/game/join: throws nested NotFoundException")
    @Test
    void joinTestGameNotFound() throws Exception {

        // arrange
        given(gameService.joinGame(anyString(), anyString())).willThrow(new NotFoundException("Game not Found"));
        JoinGameDto joinGameDto = new JoinGameDto("Laura", "1");

        // act & assert
        assertThatThrownBy(() -> mockMvc.perform(post("/game/join")
                .content(objectMapper.writeValueAsString(joinGameDto))
                .contentType(MediaType.APPLICATION_JSON))
        )
                .getCause()
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not Found");
    }

    @DisplayName("/game/play: verify correctness of response")
    @Test
    void playTest() throws Exception {

        // arrange
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("1").cardId("2").tag(PlayerTagDto.ONE).build();
        game.setGameState(GameState.IN_PROGRESS);
        game.setPlayer2("Laura");
        game.turnCard("2");
        given(gameService.turnMemoryCard(any(String.class), any(PlayerTag.class), any(String.class))).willReturn(game);
        given(gameService.applyGameRules(any(String.class))).willReturn(game);

        // act
        ResultActions response = mockMvc.perform(post("/game/play")
                .content(objectMapper.writeValueAsString(playGameDto))
                .contentType(MediaType.APPLICATION_JSON));

        // assert
        response.andExpectAll(
                status().isOk(),
                content().contentType(MediaType.APPLICATION_JSON),
                jsonPath("$.memoryBoard.gameCards[1].switched").value(true)
        );
    }

    @DisplayName("/game/play: throws nested NotFoundException")
    @Test
    void playTestGameNotFound() throws Exception {

        // arrange
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("1").cardId("2").tag(PlayerTagDto.ONE).build();
        given(gameService.turnMemoryCard(any(String.class), any(PlayerTag.class), any(String.class)))
                .willThrow(new NotFoundException("Game not Found"));

        // act & assert
        assertThatThrownBy(() -> mockMvc.perform(post("/game/play")
                .content(objectMapper.writeValueAsString(playGameDto))
                .contentType(MediaType.APPLICATION_JSON))
        )
                .getCause()
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not Found");
    }

    @DisplayName("/game/play: throws nested InvalidGameException")
    @Test
    void playTestInvalidGame() throws Exception {

        // arrange
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("1").cardId("2").tag(PlayerTagDto.ONE).build();
        given(gameService.turnMemoryCard(any(String.class), any(PlayerTag.class), any(String.class)))
                .willThrow(new InvalidGameException("Invalid Game"));

        // act & assert
        assertThatThrownBy(() -> mockMvc.perform(post("/game/play")
                .content(objectMapper.writeValueAsString(playGameDto))
                .contentType(MediaType.APPLICATION_JSON))
        )
                .getCause()
                .isInstanceOf(InvalidGameException.class)
                .hasMessage("Invalid Game");
    }

    @DisplayName("/game/play: throws nested InvalidParamException")
    @Test
    void playTestInvalidParam() throws Exception {

        // arrange
        PlayGameDto playGameDto = PlayGameDto.builder().gameId("1").cardId("2").tag(PlayerTagDto.ONE).build();
        given(gameService.turnMemoryCard(any(String.class), any(PlayerTag.class), any(String.class)))
                .willThrow(new InvalidParamException("Invalid Param"));

        // act & assert
        assertThatThrownBy(() -> mockMvc.perform(post("/game/play")
                .content(objectMapper.writeValueAsString(playGameDto))
                .contentType(MediaType.APPLICATION_JSON))
        )
                .getCause()
                .isInstanceOf(InvalidParamException.class)
                .hasMessage("Invalid Param");
    }

    @DisplayName("/game/end: verify correctness of response")
    @Test
    void endTest() throws Exception {

        // arrange
        game.setGameState(GameState.IN_PROGRESS);
        given(gameService.stopGame(any(String.class))).willReturn(game);

        // act
        ResultActions response = mockMvc.perform(post("/game/end")
                .content("1")
                .contentType(MediaType.APPLICATION_JSON));

        // assert
        response.andExpectAll(status().isOk());
    }

    @DisplayName("/game/end: throws nested NotFoundException")
    @Test
    void endTestGameNotFound() throws Exception {

        // arrange
        game.setGameState(GameState.IN_PROGRESS);
        given(gameService.stopGame(any(String.class))).willThrow(new NotFoundException("Game not Found"));

        // act & assert
        assertThatThrownBy(() -> mockMvc.perform(post("/game/end")
                .content("1")
                .contentType(MediaType.APPLICATION_JSON))
        )
                .getCause()
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Game not Found");
    }
}
