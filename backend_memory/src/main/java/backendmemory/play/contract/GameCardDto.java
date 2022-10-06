package backendmemory.play.contract;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameCardDto {
    private String cardId;
    private String connectId;
    private String word;
    private boolean switched;
    private boolean temporarilySwitched;
}
