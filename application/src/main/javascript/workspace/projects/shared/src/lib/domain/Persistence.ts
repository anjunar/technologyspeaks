import {registerConverter, registerEntity} from "../mapper";
import Link from "./container/Link";
import Table from "./container/Table";
import Row from "./container/Row";
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
import QueryTable from "./container/QueryTable";
import Sort from "./container/Sort";
import TupleTable from "./container/TupleTable";
import PropertyDescriptor from "./descriptors/PropertyDescriptor";
import {Meta} from "./container/ActiveObject";
import Media from "./types/Media";
import Thumbnail from "./types/Thumbnail";

export function init() {

    registerEntity(Table)
    registerEntity(TupleTable)
    registerEntity(Sort)
    registerEntity(QueryTable)
    registerEntity(Row)
    registerEntity(Link)

    registerEntity(CollectionDescriptor)
    registerEntity(EnumDescriptor)
    registerEntity(NodeDescriptor)
    registerEntity(ObjectDescriptor)
    registerEntity(PropertyDescriptor)
    registerEntity(Meta)

    registerEntity(NotBlankValidator)
    registerEntity(NotNullValidator)
    registerEntity(SizeValidator)
    registerEntity(EmailValidator)
    registerEntity(PastValidator)
    registerEntity(PatternValidator)

    registerEntity(Media)
    registerEntity(Thumbnail)

    registerConverter(Date, new DateConverter())
    registerConverter(LocalDateTime, new LocalDateTimeConverter())
    registerConverter(LocalDate, new LocalDateConverter())
    registerConverter(LocalTime, new LocalTimeConverter())
    registerConverter(Duration, new DurationConverter())
    registerConverter(DayOfWeek, new DayOfWeekConverter())


}