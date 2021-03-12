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

import * as strings from 'ApprovalsFieldCustomizerStrings';
import Approvals, { IApprovalsProps } from './components/Approvals';
import { MyLists } from '../../enums/MyLists';
import { IApproval } from '../../interfaces/IARInvoice';
import { PersonaShimmer } from '../../components/ShimmerComponents';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApprovalsFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'ApprovalsFieldCustomizer';

export default class ApprovalsFieldCustomizer
  extends BaseFieldCustomizer<IApprovalsFieldCustomizerProperties> {

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
    Log.info(LOG_SOURCE, 'Activated ApprovalsFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "ApprovalsFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    const personaShimmer: React.ReactElement<{}> = React.createElement(PersonaShimmer);
    ReactDOM.render(personaShimmer, event.domElement);

    let list = sp.web.lists.getByTitle(MyLists["AR Invoice Approvals"]);
   
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
      list.items
        .select(
          '*',
          'Assigned_x0020_To/Title',
          'Assigned_x0020_To/Name',
          'Assigned_x0020_To/ID',
          'Assigned_x0020_To/EMail',
          'Author/Title',
          'Author/Name',
          'Author/ID',
          'Author/EMail')
        .expand('Assigned_x0020_To, Author')
        .filter(filterString).get().then((value: IApproval[]) => {
          const approvals: React.ReactElement<{}> = React.createElement(Approvals, { approvals: [...value], currentUser: this.context.pageContext.user });
          ReactDOM.render(approvals, event.domElement);
        });
    }
    else {
      const approvals: React.ReactElement<{}> = React.createElement(Approvals, ...[]);
      ReactDOM.render(approvals, event.domElement);
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
