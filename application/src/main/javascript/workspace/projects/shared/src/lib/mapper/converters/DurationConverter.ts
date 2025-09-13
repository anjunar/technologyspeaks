import Converter from "./Converter";
import {Duration} from "@js-joda/core";

export default class DurationConverter implements Converter<string, Duration> {

    fromJson(value: string): Duration {
        if (value) {
            return Duration.parse(value)
        }
        return undefined
    }

    toJson(value: Duration): string {
        if (value) {
            return value.toJSON()
        }
        return undefined
    }

}