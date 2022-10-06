package backendmemory.play.contract;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StartGameDto {
    private String player;
    private String cardsetId;
}
