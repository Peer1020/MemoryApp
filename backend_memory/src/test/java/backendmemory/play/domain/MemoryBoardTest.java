package backendmemory.play.domain;

import backendmemory.exceptions.InvalidParamException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Unit Test MemoryBoard")
class MemoryBoardTest {

    MemoryBoard memoryBoard;
    List<GameCard> cardsetGameCards;

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
        memoryBoard = new MemoryBoard(cardsetGameCards);
    }

    @DisplayName("turn card on board")
    @Test
    void turnCardTest() throws Exception {

        // act
        memoryBoard.turnCard("3");

        //assert
        assertThat(cardsetGameCards.get(3-1).isSwitched()).isTrue();
        assertThat(cardsetGameCards.get(3-1).isTemporarilySwitched()).isFalse();
    }

    @DisplayName("turn card on board a second time, does not flip it back")
    @Test
    void turnCardNoBackFlipTest() throws Exception {

        // act
        memoryBoard.turnCard("3");
        memoryBoard.turnCard("3");

        //assert
        assertThat(cardsetGameCards.get(3-1).isSwitched()).isTrue();
        assertThat(cardsetGameCards.get(3-1).isTemporarilySwitched()).isFalse();
    }

    @DisplayName("turn card: exception thrown, if card does not exist")
    @Test
    void turnCardWithInvalidCardIdTest() {

        // act & assert
        assertThatThrownBy(() -> memoryBoard.turnCardTemporarily("0"))
                .isInstanceOf(InvalidParamException.class)
                .hasMessage("CardId does not exist");
    }

    @DisplayName("turn card temporarily on board")
    @Test
    void turnCardTemporarilyTest() throws Exception {

        // act
        memoryBoard.turnCardTemporarily("3");

        //assert
        assertThat(cardsetGameCards.get(3-1).isSwitched()).isFalse();
        assertThat(cardsetGameCards.get(3-1).isTemporarilySwitched()).isTrue();
    }

    @DisplayName("turn card temporarily on board a second time, does not flip it back")
    @Test
    void turnCardTemporarilyNoBackFlipTest() throws Exception {

        // act
        memoryBoard.turnCardTemporarily("3");
        memoryBoard.turnCardTemporarily("3");

        //assert
        assertThat(cardsetGameCards.get(3-1).isSwitched()).isFalse();
        assertThat(cardsetGameCards.get(3-1).isTemporarilySwitched()).isTrue();
    }

    @DisplayName("turn card temporarily: exception thrown, if card does not exist")
    @Test
    void turnCardTemporarilyWithInvalidCardIdTest() {

        // act & assert
        assertThatThrownBy(() -> memoryBoard.turnCardTemporarily("0"))
                .isInstanceOf(InvalidParamException.class)
                .hasMessage("CardId does not exist");
    }

    @DisplayName("behaviour of method areTwoCardsTurnedTemp")
    @ParameterizedTest(name = "{index}: {2}")
    @MethodSource("inputForAreTwoCardsTurnedTempTest")
    void areTwoCardsTurnedTempTest(
            String[] cardIdsToTempTurn,
            boolean expectedResult,
            String explanation
    ) {

        // act
        for (String id : cardIdsToTempTurn) {
            cardsetGameCards.get(Integer.parseInt(id) - 1).setTemporarilySwitched(true);
        }

        // assert
        assertThat(memoryBoard.areTwoCardsTurnedTemp()).isEqualTo(expectedResult);
    }

    private static Stream<Arguments> inputForAreTwoCardsTurnedTempTest() {
        return Stream.of(
                Arguments.of(new String[]{}, false, "false if NO card is switched temporarily"),
                Arguments.of(new String[]{"2"}, false, "false if ONE card is switched temporarily"),
                Arguments.of(new String[]{"2", "1"}, true, "true if TWO cardsetCards are switched temporarily"),
                Arguments.of(new String[]{"2", "1", "4"}, false, "false if THREE cardsetCards are switched temporarily")
        );
    }

    @DisplayName("behaviour of method turnMatchingCardsPermanentlyOrFlipBack")
    @ParameterizedTest(name = "{index}: {4}")
    @MethodSource("inputForTurnMatchingCardsPermanentlyOrFlipBackTest")
    void turnMatchingCardsPermanentlyOrFlipBackTest(
            String[] cardIdsToBeTurned,
            String[] cardIdsToTempTurn,
            boolean[] expectedCardSwitchStates,
            boolean expectedReturnValue,
            String explanation
    ) {

        // arrange
        for (String id : cardIdsToBeTurned) {
            cardsetGameCards.get(Integer.parseInt(id) - 1).setSwitched(true);
        }
        for (String id : cardIdsToTempTurn) {
            cardsetGameCards.get(Integer.parseInt(id) - 1).setTemporarilySwitched(true);
        }

        // act
        boolean check = memoryBoard.turnMatchingCardsPermanently();

        // assert
        int idx = 0;
        for (boolean expectedCardSwitchState : expectedCardSwitchStates) {
            assertThat(cardsetGameCards.get(idx).isSwitched()).isEqualTo(expectedCardSwitchState);
            assertThat(cardsetGameCards.get(idx).isTemporarilySwitched()).isFalse();
            idx++;
        }
        assertThat(check).isEqualTo(expectedReturnValue);
    }

    private static Stream<Arguments> inputForTurnMatchingCardsPermanentlyOrFlipBackTest() {
        // String[] { ... cardIdsToBeTurned... }, String[] { ... cardIdsToTempTurn... }, {isSwitched, ...} for every Card, expected returnValue of method
        return Stream.of(
                Arguments.of(new String[]{"1", "3"}, new String[]{"2", "4"}, new boolean[]{true, true, true, true}, true,
                        "switch two matching cardsetCards, with two cardsetCards uncovered already -> switchState = true of all cardsetCards; returnValue = true"),
                Arguments.of(new String[]{}, new String[]{"1", "3"}, new boolean[]{true, false, true, false}, true,
                        "switch two matching cardsetCards -> switchState = true of matching cardsetCards; returnValue = true"),
                Arguments.of(new String[]{}, new String[]{"1", "2"}, new boolean[]{false, false, false, false}, false,
                        "switch two non-matching cardsetCards -> switchState = false of all cardsetCards; returnValue = false"),
                Arguments.of(new String[]{}, new String[]{"2"}, new boolean[]{false, false, false, false}, false,
                        "switch one card (edge case which should not occur) -> switchState = false of all cardsetCards; returnValue = false"),
                Arguments.of(new String[]{}, new String[]{"2", "3", "4"}, new boolean[]{false, false, false, false}, false,
                        "switch three cardsetCards (edge case which should not occur) -> switchState = false of all cardsetCards; returnValue = false")
        );
    }

    @DisplayName("behaviour of method areAllCardsTurned")
    @ParameterizedTest(name = "{index}: {2}")
    @MethodSource("inputForAreAllCardsTurned")
    void areAllCardsTurnedTest(
            String[] cardIdsToBeTurned,
            boolean expectedReturnValue,
            String explanation
    ) {

        // arrange
        for (String id : cardIdsToBeTurned) {
            cardsetGameCards.get(Integer.parseInt(id) - 1).setSwitched(true);
        }

        // act & assert
        assertThat(memoryBoard.areAllCardsTurned()).isEqualTo(expectedReturnValue);
    }

    private static Stream<Arguments> inputForAreAllCardsTurned() {
        return Stream.of(
                Arguments.of(new String[]{"1", "3", "2", "4"}, true, "all cardsetCards turned -> true"),
                Arguments.of(new String[]{"1", "3"}, false, "two cardsetCards turned -> false"),
                Arguments.of(new String[]{}, false, "no cardsetCards turned -> false")
        );
    }
}
