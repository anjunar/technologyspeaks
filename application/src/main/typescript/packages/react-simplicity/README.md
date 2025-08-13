# react-ui-simplicity

**react-ui-simplicity** is a lightweight, flexible, and easy-to-use React component framework designed to simplify UI development. It provides powerful nested forms, context-based state management, and dynamic UI rendering to accelerate development while keeping code clean and maintainable.

## Features

- **Nested Forms**: Supports complex form structures, including array-based forms, with automatic state handling.
- **Context-Based State Management**: Uses React Context to manage form state, reducing prop-drilling and improving scalability.
- **Dynamic Components**: Easily create reusable and configurable UI components.
- **Optimized Performance**: Efficient rendering and event handling ensure a smooth user experience.
- **TypeScript Support**: Fully typed components and hooks for better developer experience and maintainability.

## Installation

```sh
npm install react-ui-simplicity
```

or

```sh
yarn add react-ui-simplicity
```

## Usage

### Basic Example

```tsx
import React, {useEffect, useState} from "react";
import {ActiveObject, Button, Form, FormModel, Input, InputContainer, SubForm, useForm, Window, HighLight} from "react-ui-simplicity";

function FormsPage() {

    const [console, setConsole] = useState("")

    function onSubmit(name: string, form: FormModel) {
        console.log("Submitted")
    }

    const user: ActiveObject & any = useForm({
        name: "Neo",
        firstName: "Thomas",
        lastName: "Anderson",
        address: {
            street: "Unknown",
            number: "Unknown",
            city: "Los Angeles",
            country: "USA"
        }
    })

    useEffect(() => {
        user.$callbacks.push((property, value) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);

    return (
        <div>
            <Form value={user} onSubmit={onSubmit}>
                <InputContainer placeholder={"Name"}>
                    <Input name={"name"} type={"text"}/>
                </InputContainer>
                <InputContainer placeholder={"First Name"}>
                    <Input name={"firstName"} type={"text"}/>
                </InputContainer>
                <InputContainer placeholder={"Last Name"}>
                    <Input name={"lastName"} type={"text"}/>
                </InputContainer>
                <SubForm name={"address"} style={{marginLeft: "48px"}}>
                    <InputContainer placeholder={"Street"}>
                        <Input name={"street"} type={"text"}/>
                    </InputContainer>
                    <InputContainer placeholder={"Number"}>
                        <Input name={"number"} type={"text"}/>
                    </InputContainer>
                    <InputContainer placeholder={"City"}>
                        <Input name={"city"} type={"text"}/>
                    </InputContainer>
                    <InputContainer placeholder={"Country"}>
                        <Input name={"country"} type={"text"}/>
                    </InputContainer>
                </SubForm>
                <Button name={"save"}>Save</Button>
            </Form>
        <p>Console: {console}</p>
      </div>)
}
```

## Documentation
For detailed documentation, visit [react-ui-simplicity Docs](https://anjunar.github.io/react-ui-simplicity).

## Contributing
Contributions are welcome! Feel free to submit issues and pull requests.

## License
This project is licensed under the MIT License.

