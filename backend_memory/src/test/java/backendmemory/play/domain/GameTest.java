package backendmemory.play.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Unit Test GameTest")
class GameTest {

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
        cardsetGameCards.add(GameCard.builder()
                .cardId("5").word("Airplane").connectId("3")
                .switched(false).build());
        cardsetGameCards.add(GameCard.builder()
                .cardId("6").word("Flugzeug").connectId("3")
                .switched(false).build());
        game = new Game(cardsetGameCards, "Jana", "setName", "de- en");
    }

    @DisplayName("behaviour of method performMove")
    @ParameterizedTest(name = "{index}: {6}")
    @MethodSource("inputForPerformMoveTest")
    void performMoveTest(
            String[] inputCardsToTempTurn, String[] inputCardsToBeTurned,
            boolean[] expectCardsTempTurned, boolean[] expectCardsTurned,
            GameState expectGameState, PlayerTag expectActivePlayer,
            String explanation
            ) {

        // arrange
        game.setPlayer2("Helen");
        game.setGameState(GameState.IN_PROGRESS);
        for (String tmpCardIds : inputCardsToTempTurn) {
            cardsetGameCards.get(Integer.parseInt(tmpCardIds)-1).setTemporarilySwitched(true);
        }
        for (String cardIds : inputCardsToBeTurned) {
            cardsetGameCards.get(Integer.parseInt(cardIds)-1).setSwitched(true);
        }

        // act
        game.applyGameRules();

        // assert
        for (int i = 0; i < expectCardsTempTurned.length; i++) {
            GameCard gameCard = cardsetGameCards.get(i);
            assertThat(gameCard.isTemporarilySwitched()).isEqualTo(expectCardsTempTurned[i]);
            assertThat(gameCard.isSwitched()).isEqualTo(expectCardsTurned[i]);
        }
        assertThat(game.getGameState()).isEqualTo(expectGameState);
        assertThat(game.isActivePlayer(expectActivePlayer)).isTrue();
    }

    private static Stream<Arguments> inputForPerformMoveTest() {
        // temporariliy turned cardsetCards, turned cardsetCards, (test input)
        // temporary switchState, switchState (expected result after act)
        // gameState, activePlayer (expected result after act)
        // explanation
        return Stream.of(
                Arguments.of(new String[]{"2"}, new String[]{"1", "3"},
                        new boolean[]{false, true, false, false, false, false}, new boolean[]{true, false, true, false, false, false},
                        GameState.IN_PROGRESS, PlayerTag.ONE,
                        "two matching cardsetCards turned & one card turned temporarily -> no changes made"),
                Arguments.of(new String[]{"1", "3"}, new String[]{"2", "4", "5", "6"},
                        new boolean[]{false, false, false, false, false, false}, new boolean[]{true, true, true, true, true, true},
                        GameState.FINISHED, PlayerTag.ONE,
                        "two matching cardsetCards turned & four matching cardsetCards turned temporarily -> all cardsetCards turned; game finished; activePlayer stays the same"),
                Arguments.of(new String[]{"1", "3"}, new String[]{},
                        new boolean[]{false, false, false, false, false, false}, new boolean[]{true, false, true, false, false, false},
                        GameState.IN_PROGRESS, PlayerTag.ONE,
                        "two matching cardsetCards turned temporarily -> this cardsetCards turned; game in progress; activePlayer stays the same"),
                Arguments.of(new String[]{"3", "4"}, new String[]{},
                        new boolean[]{false, false, false, false, false, false}, new boolean[]{false, false, false, false, false, false},
                        GameState.IN_PROGRESS, PlayerTag.TWO,
                        "two NON matching cardsetCards turned temporarily -> NO cardsetCards turned; game in progress; activePlayer changed"),
                Arguments.of(new String[]{"1", "2"}, new String[]{"5", "6"},
                        new boolean[]{false, false, false, false, false, false}, new boolean[]{false, false, false, false, true, true},
                        GameState.IN_PROGRESS, PlayerTag.TWO,
                        "two matching cardsetCards turned & two NON matching cardsetCards turned temporarily -> no changes made in turned cardsetCards; game in progress; activePlayer changed")
        );
    }
}
