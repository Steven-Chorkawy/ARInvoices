import * as React from 'react';

import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { Card, CardTitle, CardSubtitle, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';

//#region Component Methods
const MyHeader = () => {
    return (
        <ListViewHeader style={{ color: 'rgb(160, 160, 160)', fontSize: 14 }} className='pl-3 pb-2 pt-2'>
            <Button look='flat' icon='plus' primary={true} onClick={e => { e.preventDefault(); }}>Add New Account</Button>
        </ListViewHeader>
    )
}
//#endregion

class AccountCodeItem extends React.Component {
    render() {
        return (<div>hello world</div>);
    }
}

export class AccountCodeListComponent extends React.Component {

    //AccountCodeItem = props => <AccountCodeItem {...props} saveItem={this.saveData} deleteItem={this.deleteItem} />
    AccountCodeItem = props => <AccountCodeItem {...props} />

    render() {
        return (
            <ListView
                // data={this.state.data}
                item={this.AccountCodeItem}
                // style={{ width: "100%", height: 500 }}
                header={MyHeader}
            />
        );
    }
}
