import * as React from 'react';
import styles from './SubmitNewArInvoiceForm.module.scss';
import { ISubmitNewArInvoiceFormProps } from './ISubmitNewArInvoiceFormProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';

export default class SubmitNewArInvoiceForm extends React.Component<ISubmitNewArInvoiceFormProps, {}> {
  public render(): React.ReactElement<ISubmitNewArInvoiceFormProps> {
    return (
      <div className={ styles.submitNewArInvoiceForm }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
