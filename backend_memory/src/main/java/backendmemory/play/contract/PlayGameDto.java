package backendmemory.play.contract;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayGameDto {
    private String gameId;
    private String cardId;
    private PlayerTagDto tag;
}
