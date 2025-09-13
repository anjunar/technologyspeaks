import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";

@Entity("EmailValidator")
export default class EmailValidator implements Validator {}