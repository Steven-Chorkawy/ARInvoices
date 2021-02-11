/**
 * This is the object received from SharePoint when an AR Invoice is queried. 
 */
export interface IARInvoice {
    ID: number;
    Id: number;
    Title: string;
    Urgent: boolean;
    Status: string;                 // Choice Field in SharePoint
    Standard_x0020_Terms: string;   // Choice Field in SharePoint
    Department: string;             // Choice Field in SharePoint
    Requested_x0020_ById: number;
    Related_x0020_AttachmentsId: number[];
    AccountsId: number[];
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