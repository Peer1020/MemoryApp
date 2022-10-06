package backendmemory.record.contract;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CardDto {
    private String wordLng1;
    private String wordLng2;
}
