//#region Related Properties.
export interface ISPUser {
    Title: string;          // Last Name, First Name.
    Name: string;           // LoginName.
    ID: number;             // Users ID.
    EMail: string;          // Email.
}

/**
 * Common Fields that all SharePoint objects have. 
 */
interface ISPItem {
    ID: number;
    Id: number;
    Title: string;
    AuthorId: number;
    Author?: ISPUser;
    EditorId: number;
    Editor?: ISPUser;
    Created: string;
    Modified: string;
}

export interface IApproval extends ISPItem {
    AR_x0020_InvoiceId: number;
    Assigned_x0020_To: ISPUser;
    Assigned_x0020_ToId: number;
    Notes: string;
    Request_x0020_Type: string;
    Response_x0020_Message: string;
    Response_x0020_Summary: string;
    Status: string;
}

export interface IAccount extends ISPItem {
    Account_x0020_Code: string;
    Amount: number;
    HST_x0020_Taxable: boolean;
    AR_x0020_InvoiceId?: number;
}

export interface ICustomer extends ISPItem {
    GP_x0020_ID: number;
    Contact_x0020_Name: string;
    Mailing_x0020_Address: string;
    Telephone_x0020_Number: string;
}
//#endregion

/**
 * This is the object received from SharePoint when an AR Invoice is queried. 
 */
export interface IARInvoice extends ISPItem {
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
    Customer: ICustomer;
    Customer_x0020_PO_x0020_Number: string;
    Customer_x0020_Name: string;
    Customer_x0020_Details: string;
    Batch_x0020_Number: string;
    GUID: string;
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

