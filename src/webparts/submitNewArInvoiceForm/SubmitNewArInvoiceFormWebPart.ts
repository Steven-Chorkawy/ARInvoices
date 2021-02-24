import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SubmitNewArInvoiceFormWebPartStrings';
import SubmitNewArInvoiceForm from './components/SubmitNewArInvoiceForm';
import { ISubmitNewArInvoiceFormProps } from './components/SubmitNewArInvoiceForm';

import { sp } from "@pnp/sp";

import '../../MyO365.css';
import '../../bootstrap.css';
import '../../custom.css';


export interface ISubmitNewArInvoiceFormWebPartProps {
  description: string;
}

export default class SubmitNewArInvoiceFormWebPart extends BaseClientSideWebPart<ISubmitNewArInvoiceFormWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit().then(() => {
      sp.setup({
        spfxContext: this.context,
        sp: {
          headers: {
            "Accept": "application/json; odata=nometadata"
          },
          baseUrl: this.context.pageContext.web.absoluteUrl
        }
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<ISubmitNewArInvoiceFormProps> = React.createElement(
      SubmitNewArInvoiceForm,
      {
        description: this.properties.description,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
