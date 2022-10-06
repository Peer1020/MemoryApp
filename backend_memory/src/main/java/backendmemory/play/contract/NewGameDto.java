package backendmemory.play.contract;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NewGameDto {
    private String player;
    private String gameId;
    private String languages;
    private String cardsetName;
}
