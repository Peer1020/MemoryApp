package backendmemory.utils;

import backendmemory.play.domain.GameCard;
import backendmemory.record.domain.Cardset;
import backendmemory.record.domain.CardsetCard;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Unit Test CardsetMapper")
class CardsetMapperTest {

    @DisplayName("correct mapping")
    @Test
    void mapCardsetToPlayCardListTest() {
        // arrange
        List<CardsetCard> cardsetCards = new ArrayList<>();
        cardsetCards.add(new CardsetCard("ich", "I"));
        cardsetCards.add(new CardsetCard("du", "you"));
        Cardset cardset = new Cardset(
                "Test","deutsch",
                "englisch", cardsetCards
        );

        // act
        List<GameCard> gameCards = CardsetMapper.mapCardsetToPlayCardList(cardset);

        // assert
        assertThat(gameCards.size()).isEqualTo(4);
        assertThat(gameCards.get(0).getCardId()).isNotNull();
        assertThat(gameCards.get(0).getConnectId()).isNotNull();
        assertThat(gameCards.get(0).getWord()).isNotNull();
        assertThat(gameCards.get(0).isTemporarilySwitched()).isFalse();
        assertThat(gameCards.get(0).isSwitched()).isFalse();
    }

    // Todo: Add tests for edge cases (empty objects,...)
}
