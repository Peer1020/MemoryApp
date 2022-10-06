package backendmemory.play.contract;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlayerDto {
    private PlayerTagDto tag;
    private String name;
    private int pairs;
}
