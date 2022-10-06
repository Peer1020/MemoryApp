package backendmemory.play.domain;

import backendmemory.exceptions.InvalidParamException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemoryBoard {
    private List<GameCard> gameCards;

    public void turnCard(String cardId) throws InvalidParamException {
        getCard(cardId).setSwitched(true);
    }

    public void turnCardTemporarily(String cardId) throws InvalidParamException {
        getCard(cardId).setTemporarilySwitched(true);
    }

    public boolean areTwoCardsTurnedTemp() {
        return getTempSwitchedCards().size() == 2;
    }

    public boolean turnMatchingCardsPermanently() {
        if (areTwoCardsTurnedTemp() && doTwoCardsTurnedTempMatch()) {
            turnCardsPermanently();
            return true;
        } else {
            flipCardsBack();
            return false;
        }
    }

    public boolean areAllCardsTurned() {
        return gameCards.stream().allMatch(GameCard::isSwitched);
    }

    private GameCard getCard(String cardId) throws InvalidParamException {
        var card = gameCards.stream().filter(c -> c.getCardId().equals(cardId))
                .findAny().orElse(null);
        if (card == null) {
            throw new InvalidParamException("CardId does not exist");
        }
        return card;
    }

    private boolean doTwoCardsTurnedTempMatch() {
        var cardList = getTempSwitchedCards();
        if (cardList.size() == 2) {
            return cardList.get(0).getConnectId()
                    .equals(cardList.get(1).getConnectId());
        }
        return false;
    }

    private void turnCardsPermanently() {
        getTempSwitchedCards().forEach(card -> {
            card.setTemporarilySwitched(false);
            card.setSwitched(true);
        });
    }

    private void flipCardsBack() {
        getTempSwitchedCards().forEach(card ->
                card.setTemporarilySwitched(false));
    }

    private List<GameCard> getTempSwitchedCards() {
        return this.gameCards.stream()
                .filter(GameCard::isTemporarilySwitched)
                .collect(Collectors.toList());
    }

    @Override
    public Object clone() {
        MemoryBoard memoryBoard;
        try {
            memoryBoard = (MemoryBoard) super.clone();
        } catch (CloneNotSupportedException e) {
            memoryBoard = new MemoryBoard(this.getGameCards());
        }
        List<GameCard> list = new ArrayList<>();
        this.gameCards.forEach(gameCard -> {
            GameCard tmp = (GameCard) gameCard.clone();
            list.add(tmp);
        });
        memoryBoard.gameCards = list;
        return memoryBoard;
    }
}
