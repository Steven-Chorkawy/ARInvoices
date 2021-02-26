export default interface IDataOperations {
    onAdd?: Function;       // Create new record in SharePoint.
    onRemove?: Function;    // Remove from UI, not from SharePoint.
    onSave?: Function;      // Update an existing item.
    onCancel?: Function;    // Undo any changes made.
    onEdit?: Function;      // Enter Edit mode.
    onDelete?: Function;    // Delete item from SharePoint.
}