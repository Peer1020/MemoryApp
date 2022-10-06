package backendmemory.record.domain;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardsetCard {

        private @Id String id;
        private String wordLng1;
        private String wordLng2;

        public CardsetCard(String wordLng1, String wordLng2){
            this.id = UUID.randomUUID().toString();
            this.wordLng1 = wordLng1;
            this.wordLng2 = wordLng2;
        }
}
