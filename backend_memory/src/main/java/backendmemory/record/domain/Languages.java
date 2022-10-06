package backendmemory.record.domain;

import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class Languages {

    HashMap<String, String> languages = new HashMap<String, String>();


    public Languages() {
        languages.put("1", "Deutsch");
        languages.put("2", "Svenska");
        languages.put("3", "Francais");
        languages.put("4", "English");
    }


    public Map<String, String> getLanguages(){
        return languages;
    }


}
