import Converter from "./Converter";

export default class DateConverter implements Converter<string, Date>{

    fromJson(value : string) {
        return new Date(value)
    }

    toJson(value : Date) {
        return value.toJSON()
    }

}