export default interface IDataOperations {
    onAdd?: Function;       // Create new record in SharePoint.
    onRemove?: Function;    // Remove from UI, not from SharePoint.
    onSave?: Function;      // Update an existing item.
    onDelete?: Function;    // Delete item from SharePoint.
}