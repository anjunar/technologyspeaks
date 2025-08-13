package com.anjunar.scala.schema.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum LinkType {

    TABLE("table"),
    FORM("form"),
    ACTION("action"),
    OTHER("other");

    private final String value;

    LinkType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static LinkType parse(String value) {
        return Arrays.stream(LinkType.values())
                .filter(type -> type.getValue().equals(value))
                .findFirst()
                .orElse(null);
    }
}
