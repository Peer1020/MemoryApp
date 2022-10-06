package backendmemory.play.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    private PlayerTag tag;
    private String name;
    private int pairs;

    public Player(PlayerTag tag, String name) {
        this.tag = tag;
        this.name = name;
        pairs = 0;
    }

    @Override
    public String toString() {
        return  this.name;
    }

    public void incrementPairs() {
        pairs++;
    }

    @Override
    public Object clone() {
        Player player;
        try {
            player = (Player) super.clone();
        } catch (CloneNotSupportedException e) {
            player = new Player(
                    this.getTag(),
                    this.getName(),
                    this.getPairs()
            );
        }
        return player;
    }
}
