import {AbstractSearch, Primitive, Entity} from "shared";

@Entity("I18nSearch")
export default class I18nSearch extends AbstractSearch {

    override $type = "I18nSearch"

    @Primitive()
    text : string

}