package backendmemory.record;

import backendmemory.record.repository.CardsetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Todo:
// Scheint ein Integrationstest zu sein Controller <-> Repository
// Müssen wir allenfalls prüfen, was wir daraus übernehmen können

@SpringBootTest
@AutoConfigureMockMvc
public class AccessingMongodbDataRestApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CardsetRepository cardsetRepository;

    @Disabled
    @BeforeEach
    public void deleteAllBeforeTests() throws Exception {
        cardsetRepository.deleteAll();
    }


    // not used anymore
    @Disabled
    @Test
    public void shouldReturnRepositoryIndex() throws Exception {

        mockMvc.perform(get("/")).andDo(print()).andExpect(status().isOk()).andExpect(
                jsonPath("$._links.cardset").exists());
    }

    // -> Test "recordNewCardsetTest"
    @Disabled
    @Test
    public void shouldCreateEntity() throws Exception {

        mockMvc.perform(post("/cardset").content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"Englisch\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Katze\", \"wordLng2\":\"Cat\"}]}")).andExpect(
                status().isCreated()).andExpect(
                header().string("Location", containsString("cardset/")));
    }

    // -> Test "recordNewCardsetTest"
    @Disabled
    @Test
    public void shouldRetrieveEntity() throws Exception {

        MvcResult mvcResult = mockMvc.perform(post("/cardset").content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"English\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Katze\", \"wordLng2\":\"Cat\"}]}")).andExpect(
                status().isCreated()).andReturn();

        String location = mvcResult.getResponse().getHeader("Location");
        mockMvc.perform(get(location)).andExpect(status().isOk()).andExpect(
                jsonPath("$.cardsetName").value("Animals")).andExpect(
                jsonPath("$.language1").value("Deutsch")).andExpect(
                jsonPath("$.language2").value("English")).andExpect(
                jsonPath("$.card[0].wordLng1").value("Hund"));
    }

    @Disabled
    @Test
    public void shouldQueryEntity() throws Exception {

        mockMvc.perform(post("/cardset").content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"English\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Katze\", \"wordLng2\":\"Cat\"}]}")).andExpect(
                status().isCreated());

        mockMvc.perform(
                get("/cardset/search/findCardsetByCardsetName?cardsetName={name}", "Animals")).andExpect(
                status().isOk()).andExpect(
                jsonPath("$._embedded.cardset[0].cardsetName").value(
                        "Animals"));
    }


    @Disabled
    @Test
    public void shouldUpdateEntity() throws Exception {

        MvcResult mvcResult = mockMvc.perform(post("/cardset").content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"English\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Katze\", \"wordLng2\":\"Cat\"}]}")).andExpect(
                status().isCreated()).andReturn();

        String location = mvcResult.getResponse().getHeader("Location");

        mockMvc.perform(put(location).content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"English\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Maus\", \"wordLng2\":\"Mouse\"}]}")).andExpect(
                status().isNoContent());

        mockMvc.perform(get(location)).andExpect(status().isOk()).andExpect(
                jsonPath("$.card[1].wordLng1").value("Maus")).andExpect(
                jsonPath("$.card[1].wordLng2").value("Mouse"));
    }

    @Disabled
    @Test
    public void shouldPartiallyUpdateEntity() throws Exception {

        MvcResult mvcResult = mockMvc.perform(post("/cardset").content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"English\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Katze\", \"wordLng2\":\"Cat\"}]}")).andExpect(
                status().isCreated()).andReturn();

        String location = mvcResult.getResponse().getHeader("Location");

        mockMvc.perform(
                patch(location).content("{\"cardsetName\": \"Animals_New\"}")).andExpect(
                status().isNoContent());

        mockMvc.perform(get(location)).andExpect(status().isOk()).andExpect(
                jsonPath("$.cardsetName").value("Animals_New"));
    }

    @Disabled
    @Test
    public void shouldDeleteEntity() throws Exception {

        MvcResult mvcResult = mockMvc.perform(post("/cardset").content(
                "{\"cardsetName\": \"Animals\", \"language1\":\"Deutsch\", \"language2\":\"English\", \"card\":[{\"id\":\"1\",\"wordLng1\":\"Hund\", \"wordLng2\":\"Dog\"},{\"id\":\"2\",\"wordLng1\":\"Katze\", \"wordLng2\":\"Cat\"}]}")).andExpect(
                status().isCreated()).andReturn();

        String location = mvcResult.getResponse().getHeader("Location");
        mockMvc.perform(delete(location)).andExpect(status().isNoContent());

        mockMvc.perform(get(location)).andExpect(status().isNotFound());
    }
}

