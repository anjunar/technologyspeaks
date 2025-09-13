import Converter from "./Converter";
import {LocalDateTime} from "@js-joda/core";

export default class LocalDateTimeConverter implements Converter<string, LocalDateTime> {

    fromJson(value: string): LocalDateTime {
        if (value) {
            return LocalDateTime.parse(value)
        }
        return undefined
    }

    toJson(value: LocalDateTime): string {
        if (value) {
            return value.toJSON()
        }
        return undefined
    }

}