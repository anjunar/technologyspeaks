import Converter from "./Converter";
import {LocalTime} from "@js-joda/core";

export default class LocalTimeConverter implements Converter<string, LocalTime> {

    fromJson(value: string): LocalTime {
        if (value) {
            return LocalTime.parse(value)
        }
        return undefined
    }

    toJson(value: LocalTime): string {
        if (value) {
            return value.toJSON()
        }
        return undefined
    }

}