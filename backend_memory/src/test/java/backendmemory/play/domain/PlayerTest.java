package backendmemory.play.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Unit Test Player")
class PlayerTest {

    private Player player1;
    private Player player2;

    @BeforeEach
    void setUp() {

        // arrange
        player1 = new Player(PlayerTag.ONE, "Jana");
        player2 = new Player(PlayerTag.TWO, "Helen");
    }

    @DisplayName("player name should be returned in toString")
    @Test
    void toStringTest() {

        // act & assert
        assertThat(player1.toString()).isEqualTo("Jana");
        assertThat(player2.toString()).isEqualTo("Helen");
    }
}
