import * as React from 'react';

export interface IArInvoiceDetailsProps {
  description: string;
}

export default class ArInvoiceDetails extends React.Component<IArInvoiceDetailsProps, any> {
  
  constructor(props) {
    super(props);    
  }

  public render(): React.ReactElement<IArInvoiceDetailsProps> {
    return (
      <h1>hello world</h1>
    );
  }
}
