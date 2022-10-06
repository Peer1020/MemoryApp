package backendmemory.record.service;

import backendmemory.exceptions.NotFoundException;
import backendmemory.record.domain.CardsetCard;
import backendmemory.record.domain.Cardset;
import backendmemory.record.domain.Languages;
import backendmemory.record.repository.CardsetRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CardsetServiceImpl implements CardsetService {

    private final CardsetRepository cardsetRepository;

    public CardsetServiceImpl(CardsetRepository cardsetRepository) {
        this.cardsetRepository = cardsetRepository;
    }

    @Override
    public Cardset createCardset(String cardsetName, String language1, String language2, List<CardsetCard> cardsetCards) {
        Cardset cardset = new Cardset(cardsetName, language1, language2, cardsetCards);
        cardsetRepository.save(cardset);
        return cardset;
    }

    @Override
    public Map<String, String> getCardsetNames() {
        List<Cardset> cardsets = cardsetRepository.findAll();
        HashMap<String, String> map = new HashMap<>();
        cardsets.forEach(cardset -> map.put(cardset.getId(), cardset.getCardsetName()));
        return map;
    }

    public Map<String, String> getLanguages() {
        Languages languages = new Languages();
        return languages.getLanguages();
    }



    public List<Cardset> getAllCardsets() {
        return cardsetRepository.findAll();
    }

    @Override
    public Cardset getCardset(String id) throws NotFoundException {
        return cardsetRepository.findAll().stream()
                .filter(cardset -> cardset.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Cardset not found"));
    }

    @Override
    public void deleteAllCardsets() {
        cardsetRepository.deleteAll();
    }
}
