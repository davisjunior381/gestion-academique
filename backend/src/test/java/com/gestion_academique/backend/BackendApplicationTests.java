package com.gestion_academique.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

@EnabledIfEnvironmentVariable(named = "SPRING_TEST_CONTEXT", matches = "true")
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
