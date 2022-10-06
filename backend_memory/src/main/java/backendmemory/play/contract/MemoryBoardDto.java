package backendmemory.play.contract;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MemoryBoardDto {
    private List<GameCardDto> gameCards;
}
