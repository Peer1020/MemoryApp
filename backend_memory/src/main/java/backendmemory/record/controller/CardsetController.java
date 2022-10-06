package backendmemory.record.controller;

import backendmemory.exceptions.NotFoundException;
import backendmemory.record.contract.CardsetDto;
import backendmemory.record.domain.Cardset;
import backendmemory.record.domain.CardsetCard;
import backendmemory.record.service.CardsetService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600, methods = {RequestMethod.OPTIONS,
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE}, allowedHeaders = "*")
@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/cardset")
public class CardsetController {

    private final CardsetService cardsetService;

    @GetMapping("/all")
    public ResponseEntity<Map<String, String>> getAvailableCardsets() {
        log.info("get all available cardsets");
        return ResponseEntity.ok(cardsetService.getCardsetNames());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cardset> getCardset(@PathVariable String id) throws NotFoundException {
        log.info("get specific cardset {}", id);
        Cardset cardset = cardsetService.getCardset(id);
        return ResponseEntity.ok(cardset);
    }

    @GetMapping("/languages")
    public ResponseEntity<Map<String, String>> getLanguages() {
        log.info("get all available languages");
        return ResponseEntity.ok(cardsetService.getLanguages());
    }



    @PostMapping("/record")
    public ResponseEntity<Cardset> recordNewCardset(@RequestBody CardsetDto cardsetDto) {
        log.info("create new cardset {}", cardsetDto);
        ArrayList<CardsetCard> cardsetCards = new ArrayList<>();
                cardsetDto.getCardsetCards().forEach(
                c -> cardsetCards.add(new CardsetCard(c.getWordLng1(), c.getWordLng2())));
        Cardset cardset = cardsetService.createCardset(cardsetDto.getCardsetName(),
                cardsetDto.getLanguage1(),
                cardsetDto.getLanguage2(),
                cardsetCards);
        return ResponseEntity.ok(cardset);
    }

    @DeleteMapping("/")
    public void deleteCardsets() {
        log.info("delete all cardsets in database");
        cardsetService.deleteAllCardsets();
    }

    @GetMapping("/")
    public ResponseEntity<List<Cardset>> getCardsets() {
        log.info("get all cardsets in database");
        return ResponseEntity.ok(cardsetService.getAllCardsets());
    }
}



