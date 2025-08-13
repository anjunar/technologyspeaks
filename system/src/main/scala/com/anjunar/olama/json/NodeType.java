package com.anjunar.olama.json;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum NodeType {

    ARRAY("array"),
    OBJECT("object"),
    INTEGER("integer"),
    LONG("long"),
    FLOAT("float"),
    DOUBLE("double"),
    BOOLEAN("boolean"),
    STRING("string"),
    FUNCTION("function");

    private final String value;

    NodeType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    static NodeType fromString(String arg) {
        return Arrays
                .stream(NodeType.values())
                .filter(node -> node.value.equals(arg)).findFirst()
                .orElse(null);
    }
}
