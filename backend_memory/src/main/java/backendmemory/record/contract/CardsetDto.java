package backendmemory.record.contract;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class CardsetDto {
    private String cardsetName;
    private String language1;
    private String language2;
    private List<CardDto> cardsetCards;
}
