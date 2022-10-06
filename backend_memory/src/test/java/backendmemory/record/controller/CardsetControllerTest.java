package backendmemory.record.controller;

import backendmemory.record.contract.CardsetDto;
import backendmemory.record.domain.CardsetCard;
import backendmemory.record.domain.Cardset;
import backendmemory.record.service.CardsetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Todo: Noch erweitern
@DisplayName("Unit Test CardsetController")
@WebMvcTest(controllers = CardsetController.class)
class CardsetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CardsetService cardsetService;

    @Autowired
    private ObjectMapper objectMapper;

    private Cardset cardset;
    private List<CardsetCard> cardsetCards = new ArrayList<>();
    private CardsetCard cardsetCard1;
    private CardsetDto cardsetDto;

    @BeforeEach
    void setUp() {
        cardsetCard1 = CardsetCard.builder().id("1").wordLng1("house").wordLng2("Haus").build();
    }

    @Test
    void recordNewCardsetTest() throws Exception {
        // arrange
        cardsetDto = CardsetDto.builder()
                .cardsetName("Test")
                .language1("english")
                .language2("deutsch")
                .cardsetCards(new ArrayList<>()).build();
        cardsetCards.add(cardsetCard1);
        cardset = Cardset.builder().cardsetName("Test").id("1")
                .language1("english").language2("deutsch")
                .cards(cardsetCards).build();
        given(cardsetService
                .createCardset(anyString(), anyString(), anyString(), anyList()))
                .willReturn(cardset);

        // act
        ResultActions response = mockMvc.perform(
                post("/cardset/record")
                        .content(objectMapper.writeValueAsString(cardsetDto))
                        .contentType(MediaType.APPLICATION_JSON));

        // assert
        response.andExpectAll(
                status().isOk(),
                content().contentType(MediaType.APPLICATION_JSON),
                jsonPath("$.id").isNotEmpty()
        );
    }
}
