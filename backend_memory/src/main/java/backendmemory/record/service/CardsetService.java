package backendmemory.record.service;

import backendmemory.exceptions.NotFoundException;
import backendmemory.record.domain.CardsetCard;
import backendmemory.record.domain.Cardset;

import java.util.List;
import java.util.Map;

public interface CardsetService {
    Cardset createCardset(String cardsetName, String language1, String language2, List<CardsetCard> cardsetCards);
    Map<String, String> getCardsetNames();
    Map<String, String> getLanguages();
    List<Cardset> getAllCardsets();
    Cardset getCardset(String id) throws NotFoundException;
    void deleteAllCardsets();
}
