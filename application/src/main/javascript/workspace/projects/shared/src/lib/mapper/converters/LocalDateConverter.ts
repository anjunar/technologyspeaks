import Converter from "./Converter";
import {LocalDate} from "@js-joda/core";

export default class LocalDateConverter implements Converter<string, LocalDate> {

    fromJson(value: string): LocalDate {
        if (value) {
            return LocalDate.parse(value)
        }
        return undefined
    }

    toJson(value: LocalDate): string {
        if (value) {
            return value.toJSON()
        }
        return undefined
    }

}