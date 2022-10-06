package backendmemory.record.domain;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cardset {

	private @Id String id;
	private String cardsetName;
	private String language1;
	private String language2;
	private List<CardsetCard> cards;

	public Cardset(String cardsetName, String language1, String language2, List<CardsetCard> cards){
		this.id = UUID.randomUUID().toString();
		this.cardsetName = cardsetName;
		this.language1 = language1;
		this.language2 = language2;
		this.cards = cards;
	}

}
