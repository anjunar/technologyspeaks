export default interface Converter<I, O> {

    fromJson(value : I) : O

    toJson(value : O) : I

}