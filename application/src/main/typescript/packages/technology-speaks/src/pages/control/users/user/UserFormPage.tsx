import "./UserFormPage.css"
import React from 'react';
import User from "../../../../domain/control/User";
import {JsFlag, SchemaFormTemplate, SchemaImage, SchemaInput, SchemaSubForm} from "shared";
import SecuredProperty from "../../../../components/security/SecuredProperty";

export function UserFormPage(properties: UserFormPage.Attributes) {

    const {form} = properties

    return (
        <div className={"user-form-page center"}>
            <div className={"panel"}>
                <SchemaFormTemplate value={form}>
                    <div style={{display: "flex", flex: 1, gap: "12px", alignItems: "center"}}>
                        <div>
                            <SchemaSubForm name={"info"}>
                                <SchemaImage name={"image"} style={{width: "400px", height: "400px"}}/>
                            </SchemaSubForm>
                        </div>
                        <div style={{flex: 1}}>
                            <SchemaInput name={"id"}/>
                            <SchemaInput name={"nickName"}/>
                            <div style={{display: "flex", width: "100%"}}>
                                <SchemaSubForm name={"info"} style={{width: "100%"}}>
                                    <SchemaInput name={"firstName"}/>
                                    <SchemaInput name={"lastName"}/>
                                    <SchemaInput name={"birthDate"}/>
                                    <JsFlag showWhenJs={false}>
                                        <SchemaInput name={"image"}/>
                                    </JsFlag>
                                </SchemaSubForm>
                                <SecuredProperty descriptor={form.$descriptors.properties["info"]}/>
                            </div>
                            <div style={{display: "flex", width: "100%"}}>
                                <SchemaSubForm name={"address"} style={{width: "100%"}}>
                                    <SchemaInput name={"street"}/>
                                    <SchemaInput name={"number"}/>
                                    <SchemaInput name={"zipCode"}/>
                                    <SchemaInput name={"country"}/>
                                </SchemaSubForm>
                                <SecuredProperty descriptor={form.$descriptors.properties["address"]}/>
                            </div>
                        </div>
                    </div>
                </SchemaFormTemplate>
            </div>
        </div>
    )
}

export namespace UserFormPage {
    export interface Attributes {
        form: User
    }
}

export default UserFormPage