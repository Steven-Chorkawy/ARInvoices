import * as React from 'react';

import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { Card, CardTitle, CardSubtitle, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';

//#region Component Methods
const MyHeader = (props) => {
    return (
        <ListViewHeader style={{ color: 'rgb(160, 160, 160)', fontSize: 14 }} className='pl-3 pb-2 pt-2'>
            <Button
                look='flat'
                icon='plus'
                primary={true}
                onClick={e => {
                    e.preventDefault();
                    debugger;
                    props.onAdd();
                }}
            >Add New Account</Button>
        </ListViewHeader>
    );
};
//#endregion

class AccountCodeItem extends React.Component {
    public render() {
        return (
            <Card>
                <CardBody>
                    <CardTitle>Card Title</CardTitle>
                    <CardTitle>Card Subtitle</CardTitle>
                    <p>Some quick example text to build on the card title and make up the bulk of the card content.</p>
                </CardBody>
            </Card>
        );
    }
}

export class AccountCodeListComponent extends React.Component<any, any> {

    //AccountCodeItem = props => <AccountCodeItem {...props} saveItem={this.saveData} deleteItem={this.deleteItem} />
    public AccountCodeItem = props => <AccountCodeItem {...props} />;

    public render() {
        return (
            <ListView
                data={this.props.data}
                item={this.AccountCodeItem}
                // style={{ width: "100%", height: 500 }}
                header={() => MyHeader(this.props)}
            />
        );
    }
}
