permissionset 50000 ar_EventAdminPermSet
{
    Caption = 'Event Administrator';
    Assignable = true;
    Permissions = tabledata ar_Event = RIMD,
        table ar_Event = X,
        codeunit ar_EventFunctions = X,
        page ar_EventsCalendar = X,
        page ar_EventsList = X;
}