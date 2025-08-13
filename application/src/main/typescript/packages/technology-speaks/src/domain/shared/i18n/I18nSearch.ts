import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";

@Entity("I18nSearch")
export default class I18nSearch extends AbstractSearch {

    $type = "I18nSearch"

    @Basic()
    text : string

}