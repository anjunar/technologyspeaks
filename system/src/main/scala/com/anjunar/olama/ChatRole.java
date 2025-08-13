package com.anjunar.olama;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ChatRole {

    SYSTEM("system"),
    USER("user"),
    ASSISTANT("assistant"),
    TOOL("tool");

    private final String value;

    ChatRole(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    static ChatRole fromString(String arg) {
        return Arrays
                .stream(ChatRole.values())
                .filter(node -> node.value.equals(arg)).findFirst()
                .orElse(null);
    }


}
