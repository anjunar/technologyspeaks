import {AbstractSearch, Basic, Entity} from "shared";

@Entity("I18nSearch")
export default class I18nSearch extends AbstractSearch {

    override $type = "I18nSearch"

    @Basic()
    text : string

}