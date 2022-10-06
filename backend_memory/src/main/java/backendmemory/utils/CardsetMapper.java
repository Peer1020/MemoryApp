package backendmemory.utils;

import backendmemory.play.domain.GameCard;
import backendmemory.record.domain.Cardset;
import backendmemory.record.domain.CardsetCard;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CardsetMapper {
    public static List<GameCard> mapCardsetToPlayCardList(Cardset cardset) {
        List<GameCard> gameCards = new ArrayList<>();
        List<CardsetCard> cardsetCards = cardset.getCards();
        for (int i = 0; i < cardsetCards.size(); i++) {
            gameCards.add(new GameCard(String.valueOf(i+1), cardsetCards.get(i).getWordLng1()));
            gameCards.add(new GameCard(String.valueOf(i+1), cardsetCards.get(i).getWordLng2()));
        }
        Collections.shuffle(gameCards);
        return gameCards;
    }
}
