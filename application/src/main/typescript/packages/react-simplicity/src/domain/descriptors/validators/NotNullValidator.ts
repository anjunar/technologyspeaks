import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";

@Entity("NotNullValidator")
export default class NotNullValidator implements Validator {}