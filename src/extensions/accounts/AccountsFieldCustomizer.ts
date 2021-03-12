import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'AccountsFieldCustomizerStrings';
import Accounts from './components/Accounts';
import { MyLists } from '../../enums/MyLists';
import { IAccount } from '../../interfaces/IARInvoice';
import { RowShimmer } from '../../components/ShimmerComponents';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAccountsFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'AccountsFieldCustomizer';

export default class AccountsFieldCustomizer
  extends BaseFieldCustomizer<IAccountsFieldCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context,
      sp: {
        headers: {
          "Accept": "application/json; odata=nometadata"
        },
        baseUrl: this.context.pageContext.web.absoluteUrl
      }
    });
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated AccountsFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "AccountsFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    const shimmer: React.ReactElement<{}> = React.createElement(RowShimmer);
    ReactDOM.render(shimmer, event.domElement);

    let list = sp.web.lists.getByTitle(MyLists["AR Invoice Accounts"]);

    if (event.fieldValue.length > 0) {
      // Build the query string.
      let filterString: string = '';
      for (let index = 0; index < event.fieldValue.length; index++) {
        const element = event.fieldValue[index];
        index === 0 ?
          filterString = `Id eq ${element.lookupId}` :
          filterString = `${filterString} or Id eq ${element.lookupId}`;
      }

      // Query the item
      list.items.filter(filterString).get().then((value: IAccount[]) => {
        const accounts: React.ReactElement<{}> = React.createElement(Accounts, { accounts: [...value] });
        ReactDOM.render(accounts, event.domElement);
      });
    }
    else {
      const accounts: React.ReactElement<{}> = React.createElement(Accounts, ...[]);
      ReactDOM.render(accounts, event.domElement);
    }
  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
