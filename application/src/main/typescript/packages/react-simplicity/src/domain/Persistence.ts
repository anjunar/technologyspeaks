import {registerConverter, registerEntity} from "../mapper";
import LinkObject from "./container/LinkObject";
import Media from "../components/inputs/upload/image/Media";
import TableObject from "./container/TableObject";
import RowObject from "./container/RowObject";
import Thumbnail from "../components/inputs/upload/image/Thumbnail";
import DateConverter from "../mapper/converters/DateConverter";
import LocalDateTimeConverter from "../mapper/converters/LocalDateTimeConverter";
import LocalDateConverter from "../mapper/converters/LocalDateConverter";
import DurationConverter from "../mapper/converters/DurationConverter";
import NotBlankValidator from "./descriptors/validators/NotBlankValidator";
import SizeValidator from "./descriptors/validators/SizeValidator";
import NotNullValidator from "./descriptors/validators/NotNullValidator";
import EmailValidator from "./descriptors/validators/EmailValidator";
import PastValidator from "./descriptors/validators/PastValidator";
import LocalTimeConverter from "../mapper/converters/LocalTimeConverter";
import DayOfWeekConverter from "../mapper/converters/DayOfWeekConverter";
import {DayOfWeek, Duration, LocalDate, LocalDateTime, LocalTime} from "@js-joda/core";
import PatternValidator from "./descriptors/validators/PatternValidator";
import CollectionDescriptor from "./descriptors/CollectionDescriptor";
import EnumDescriptor from "./descriptors/EnumDescriptor";
import NodeDescriptor from "./descriptors/NodeDescriptor";
import ObjectDescriptor from "./descriptors/ObjectDescriptor";
import QueryTableObject from "./container/QueryTableObject";
import EditorModel from "../components/inputs/markdown/domain/EditorModel";
import EditorFile from "../components/inputs/markdown/domain/EditorFile";
import SortObject from "./container/SortObject";
import TupleTableObject from "./container/TupleTableObject";
import Change from "../components/inputs/markdown/domain/Change";
import PropDescriptor from "./descriptors/PropDescriptor";

export function init() {

    registerEntity(TableObject)
    registerEntity(TupleTableObject)
    registerEntity(SortObject)
    registerEntity(QueryTableObject)
    registerEntity(RowObject)
    registerEntity(LinkObject)
    registerEntity(Media)
    registerEntity(Thumbnail)

    registerEntity(CollectionDescriptor)
    registerEntity(EnumDescriptor)
    registerEntity(NodeDescriptor)
    registerEntity(ObjectDescriptor)
    registerEntity(PropDescriptor)

    registerEntity(NotBlankValidator)
    registerEntity(NotNullValidator)
    registerEntity(SizeValidator)
    registerEntity(EmailValidator)
    registerEntity(PastValidator)
    registerEntity(PatternValidator)

    registerEntity(EditorModel)
    registerEntity(EditorFile)
    registerEntity(Change)

    registerConverter(Date, new DateConverter())
    registerConverter(LocalDateTime, new LocalDateTimeConverter())
    registerConverter(LocalDate, new LocalDateConverter())
    registerConverter(LocalTime, new LocalTimeConverter())
    registerConverter(Duration, new DurationConverter())
    registerConverter(DayOfWeek, new DayOfWeekConverter())


}