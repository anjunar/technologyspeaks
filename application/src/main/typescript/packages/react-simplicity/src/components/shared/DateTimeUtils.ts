import {DateTimeFormatter, LocalDate, LocalDateTime, LocalTime} from "@js-joda/core";
import {Locale} from "@js-joda/locale_de";

export function format(time: LocalTime | LocalDate | LocalDateTime, pattern: string): string {
    try {
        return time.format(DateTimeFormatter.ofPattern(pattern).withLocale(Locale.GERMANY))
    } catch (e) {
        return undefined
    }
}