package backendmemory.utils;

import backendmemory.play.contract.GameCardDto;
import backendmemory.play.contract.GameDto;
import backendmemory.play.domain.Game;
import backendmemory.play.domain.GameCard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Unit Test GameMapper")
class GameMapperTest {

    List<GameCard> cardsetGameCards;
    Game game;

    @BeforeEach
    void setUp() {
        cardsetGameCards = new ArrayList<>();
        cardsetGameCards.add(GameCard.builder()
                .cardId("1").word("Haus").connectId("1")
                .switched(false).build());
        cardsetGameCards.add(GameCard.builder()
                .cardId("2").word("Auto").connectId("2")
                .switched(false).build());
        cardsetGameCards.add(GameCard.builder()
                .cardId("3").word("House").connectId("1")
                .switched(false).build());
        cardsetGameCards.add(GameCard.builder()
                .cardId("4").word("Car").connectId("2")
                .switched(false).build());
        game = new Game(cardsetGameCards, "Jana", "setName", "de- en");
    }

    @DisplayName("correct mapping")
    @Test
    void mapGameToGameDtoTest() {
        // act
        GameDto gameDto = GameMapper.mapGameToGameDto(game);

        // assert
        assertThat(gameDto.getGameId()).isNotNull();
        assertThat(gameDto.getPlayer1()).isNotEqualTo(game.getPlayer1());
        assertThat(gameDto.getPlayer1().getName()).isEqualTo(game.getPlayer1().getName());
        assertThat(gameDto.getPlayer1().getTag().name()).isEqualTo(game.getPlayer1().getTag().name());
        assertThat(gameDto.getPlayer1().getPairs()).isEqualTo(game.getPlayer1().getPairs());

        assertThat(gameDto.getActivePlayer()).isNotEqualTo(game.getActivePlayer());
        assertThat(gameDto.getActivePlayer().getName()).isEqualTo(game.getActivePlayer().getName());
        assertThat(gameDto.getActivePlayer().getTag().name()).isEqualTo(game.getActivePlayer().getTag().name());
        assertThat(gameDto.getActivePlayer().getPairs()).isEqualTo(game.getActivePlayer().getPairs());

        assertThat(gameDto.getPlayer2()).isNull();

        assertThat(gameDto.getMemoryBoard()).isNotEqualTo(game.getMemoryBoard());
        for (int i = 0; i < gameDto.getMemoryBoard().getGameCards().size(); i++) {
            GameCardDto cardDto = gameDto.getMemoryBoard().getGameCards().get(i);
            GameCard gameCard = game.getMemoryBoard().getGameCards().get(i);
            assertThat(cardDto.getCardId()).isEqualTo(gameCard.getCardId());
            assertThat(cardDto.getConnectId()).isEqualTo(gameCard.getConnectId());
            assertThat(cardDto.isSwitched()).isEqualTo(gameCard.isSwitched());
            assertThat(cardDto.isTemporarilySwitched()).isEqualTo(gameCard.isTemporarilySwitched());
            if (cardDto.isTemporarilySwitched() || cardDto.isSwitched()) {
                assertThat(cardDto.getWord()).isEqualTo(gameCard.getWord());
            } else {
                assertThat(cardDto.getWord()).isNull();
            }
        }

        assertThat(gameDto.getGameState().name()).isEqualTo(game.getGameState().name());
        assertThat(gameDto.getCardsetName()).isEqualTo(game.getCardsetName());
        assertThat(gameDto.getLanguages()).isEqualTo(game.getLanguages());
    }
}
