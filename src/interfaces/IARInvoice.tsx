//#region Related Properties.
export interface ISPUser {
    Title: string;          // Last Name, First Name.
    Name: string;           // LoginName.
    ID: number;             // Users ID.
    EMail: string;          // Email.
}

export interface IApproval {
    ID: number;
    Id: number;
    AR_x0020_InvoiceId: number;
    Assigned_x0020_To: ISPUser;
    Assigned_x0020_ToId: number;
    Notes: string;
    Request_x0020_Type: string;
    Response_x0020_Message: string;
    Response_x0020_Summary: string;
    Status: string;
    Title: string;
    AuthorId: number;
    EditorId: number;
    Created: string;
    Modified: string;
}

export interface IAccount {
    Title: string;
    Account_x0020_Code: string;
    Amount: number;
    HST_x0020_Taxable: boolean;
    AR_x0020_InvoiceId?: number;
    AuthorId: number;
    EditorId: number;
}
//#endregion

/**
 * This is the object received from SharePoint when an AR Invoice is queried. 
 */
export interface IARInvoice {
    ID: number;
    Id: number;
    Title: string;
    Urgent: boolean;
    Attachments: boolean;           // SharePoint uses this property to let us know if there are any attachments on a list item.
    AttachmentFiles?: any[];         // This is the property we will use to access attachments.
    Status: string;                 // Choice Field in SharePoint
    Standard_x0020_Terms: string;   // Choice Field in SharePoint
    Department: string;             // Choice Field in SharePoint
    Requested_x0020_ById: number;
    Requested_x0020_By: ISPUser;
    AccountsId: number[];
    Accounts: IAccount[];
    ApprovalsId: number[];
    Approvals: IApproval[];
    Invoice_x0020_Number: string;
    Details: string;
    Date: string;
    CustomerId: number;
    Customer_x0020_PO_x0020_Number: string;
    Customer_x0020_Name: string;
    Customer_x0020_Details: string;
    Batch_x0020_Number: string;

    AuthorId: number;
    EditorId: number;
    Created: string;
    Modified: string;
}

/**
 * This is the object sent to SharePoint when an AR Invoice is created or updated. 
 * 
 * TODO: Test this interface to make sure it works.
 */
export interface ISaveARInvoice {
    Title: string;
    Urgent: boolean;
    Status: string;                 // Choice Field in SharePoint
    Standard_x0020_Terms: string;   // Choice Field in SharePoint
    Department: string;             // Choice Field in SharePoint
    Requested_x0020_ById: number;
    Related_x0020_AttachmentsId: number[];  // TODO: Make an interface to represent lookup fields. 
    AccountsId: number[];                   // TODO: Make an interface to represent lookup fields.
    Invoice_x0020_Number: string;
    Details: string;
    Date: string;
    CustomerId: number;
    Batch_x0020_Number: string;
}

