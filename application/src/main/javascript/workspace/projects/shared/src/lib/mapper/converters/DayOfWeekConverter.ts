import Converter from "./Converter";
import {DayOfWeek} from "@js-joda/core";

export default class DayOfWeekConverter implements Converter<string, DayOfWeek> {

    fromJson(value: any): DayOfWeek {
        if (value) {
            return DayOfWeek.valueOf(value)
        }
        return undefined;
    }

    toJson(value: DayOfWeek): string {
        if (value) {
            return value.toJSON()
        }
        return undefined
    }

}