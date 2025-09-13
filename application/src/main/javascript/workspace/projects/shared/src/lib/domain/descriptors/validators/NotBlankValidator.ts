import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";

@Entity("NotBlankValidator")
export default class NotBlankValidator implements Validator {}