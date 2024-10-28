page 50001 ar_EventsCalendar
{
    Caption = 'Events Calendar';
    PageType = Document;
    ApplicationArea = All;
    UsageCategory = Tasks;

    layout
    {
        area(Content)
        {
            usercontrol(EventsCalendar; ar_TuiCalendarCtrl)
            {
                ApplicationArea = All;

                trigger OnControlAddInReady()
                begin
                    UpdateCalendar();
                end;

                trigger ShowMessageOnBC(msg: Text)
                begin
                    Message(msg);
                end;

                trigger UpdateEvent(eventId: Text; updatedEvent: JsonObject)
                begin
                    eventFunctions.UpdateEventStartEnd(eventId, updatedEvent);
                end;

                trigger DeleteEvent(eventId: Text)
                begin
                    eventFunctions.DeleteEvent(eventId);
                end;

                trigger AddEvent(eventObject: JsonObject)
                begin
                    eventFunctions.CreateEvent(eventObject);
                end;
            }
        }
    }

    actions
    {
        area(navigation)
        {
            group("&Events")
            {

                action("E&vents")
                {
                    ApplicationArea = All;
                    Caption = 'E&vents';
                    Image = "Event";
                    ToolTip = 'View or add events the calendar.';

                    trigger OnAction()
                    begin
                        IsCalendarEmpty := false;

                        Page.RunModal(Page::ar_EventsList);
                        UpdateCalendar();
                    end;
                }
            }
        }
    }

    trigger OnOpenPage()
    begin
        if not eventsTable.FindSet() then
            IsCalendarEmpty := true;
    end;

    trigger OnAfterGetRecord()
    begin
        UpdateCalendar();
    end;

    procedure UpdateCalendar()
    var
        jsonEventArray: JsonArray;
        jsonEvent: JsonObject;
        jsonText: Text;
    begin
        if IsCalendarEmpty then
            exit;

        eventsTable.Reset();

        if not eventsTable.FindSet() then
            exit;

        Clear(jsonEventArray);

        repeat
            Clear(jsonEvent);
            jsonEvent.Add('id', eventsTable."No.");
            jsonEvent.Add('title', eventsTable.Title);
            jsonEvent.Add('body', eventsTable.Description);
            jsonEvent.Add('calendarId', eventsTable.Color.Names.Get(eventsTable.Color.Ordinals.IndexOf(eventsTable.Color.AsInteger)));
            jsonEvent.Add('isAllday', eventsTable."All Day Event");
            jsonEvent.Add('start', eventsTable."Start Date");
            jsonEvent.Add('end', eventsTable."End Date");
            jsonEventArray.Add((jsonEvent));
        until eventsTable.Next() = 0;

        jsonEventArray.WriteTo(jsonText);
        SendToJs(jsonText);
    end;

    procedure SendToJs(eventData: Text)
    begin
        CurrPage.EventsCalendar.RetrieveData(eventData);
    end;

    var
        eventsTable: Record ar_Event;
        IsCalendarEmpty: Boolean;
        eventFunctions: Codeunit ar_EventFunctions;
}