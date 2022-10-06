package backendmemory.play.domain;


import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameCard {
    private @Id String cardId;
    private String connectId;
    private String word;
    private boolean switched;
    private boolean temporarilySwitched;

    public GameCard(String connectId, String word) {
        this.cardId = UUID.randomUUID().toString();
        this.connectId = connectId;
        this.word = word;
        this.switched = false;
        this.temporarilySwitched = false;
    }

    @Override
    public Object clone() {
        GameCard gameCard;
        try {
            gameCard = (GameCard) super.clone();
        } catch (CloneNotSupportedException e) {
            gameCard = new GameCard(
                    this.getCardId(),
                    this.getConnectId(),
                    this.getWord(),
                    this.isSwitched(),
                    this.isTemporarilySwitched()
            );
        }
        return gameCard;
    }
}
