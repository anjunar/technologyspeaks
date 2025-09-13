import "./UserSearchPage.css"
import React from 'react';
import User from "../../../../domain/control/User";
import {LinkContainerObject, ObjectDescriptor} from "shared";

const encodeBase64 = (type: string, data: string) => {
    if (data) {
        return `data:${type};base64,${data}`
    }
    return null
}

export function UserSearchPage(properties: Users.Attributes) {

    const {users : [rows, size]} = properties

    return (
        <div className={"users-page"}>
            <div className={"grid-container"}>
                {
                    rows.map(user => (
                        <a key={user.id} className={"user"} href={"/control/users/user/" + user.id} style={{display : "flex", flexDirection : "column", alignItems : "center"}}>
                            <div>
                                {
                                    user.info?.image ?
                                        (<img src={encodeBase64(user.info.image.contentType, user.info.image.data)} style={{width : "100px", height : "100px"}}/>) :
                                        (<div style={{fontSize : "100px"}} className={"material-icons"}>account_circle</div>)
                                }
                            </div>
                            <div>
                                <h2>{user.nickName? user.nickName : "Nickname"}</h2>
                            </div>
                            {
                                user.info ? user.info.firstName + " " + user.info.lastName : "No information"
                            }
                        </a>
                    ))
                }
            </div>
        </div>
    )
}

export namespace Users {
    export interface Attributes {
        users : [User[], number, LinkContainerObject, ObjectDescriptor]
    }
}

export default UserSearchPage;