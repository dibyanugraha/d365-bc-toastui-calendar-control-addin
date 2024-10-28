codeunit 50000 ar_EventFunctions
{
    procedure UpdateEventStartEnd(eventId: Code[50]; updatedEvent: JsonObject)
    var
        eventNewStartDateTime: DateTime;
        eventNewEndDateTime: DateTime;
        tempJsonToken: JsonToken;
        title: Text;
        isAllDay: Boolean;
        tempTokenText: Text;
        calendarId: Text;
        eventColor: Enum ar_Colors;
    begin
        if not eventTable.Get(eventId) then
            exit;

        if updatedEvent.Contains('start') then begin
            eventNewStartDateTime := ProcessChangedDateTime(updatedEvent, 'start');
            eventTable."Start Date" := eventNewStartDateTime;
        end;

        if updatedEvent.Contains('end') then begin
            eventNewEndDateTime := ProcessChangedDateTime(updatedEvent, 'end');
            eventTable."End Date" := eventNewEndDateTime;
        end;

        if updatedEvent.Get('isAllday', tempJsonToken) then begin
            tempJsonToken.WriteTo(tempTokenText);
            if tempTokenText.Replace('"', '') = 'true' then
                isAllDay := true;

            eventTable."All Day Event" := isAllDay;
        end;

        if updatedEvent.Get('title', tempJsonToken) then begin
            tempJsonToken.WriteTo(title);
            eventTable.Title := title.Replace('"', '');
        end;

        if updatedEvent.Get('calendarId', tempJsonToken) then begin
            tempJsonToken.WriteTo(calendarId);
            case calendarId.Replace('"', '') of
                'cal1':
                    eventColor := eventColor::cal1;
                'cal2':
                    eventColor := eventColor::cal2;
                'cal3':
                    eventColor := eventColor::cal3;
                'cal4':
                    eventColor := eventColor::cal4;
                else
                    eventColor := eventColor::cal1;
            end;
            eventTable.Color := eventColor;
        end;

        eventTable.Modify();
    end;

    procedure DeleteEvent(eventId: Code[50])
    begin
        if not eventTable.Get(eventId) then
            exit;

        eventTable.Delete();
    end;

    procedure CreateEvent(eventObject: JsonObject)
    var
        tempJsonToken: JsonToken;
        tempJsonTokenD: JsonToken;
        tempJsonTokenDd: JsonToken;
        title: Text;
        isAlldayTxt: Text;
        resultDateTimeTxt: Text;
        eventStartDateTime: DateTime;
        eventEndDateTime: DateTime;
        isAllday: Boolean;
        calendarId: Text;
        eventColor: Enum ar_Colors;
        newEventTable: Record ar_Event;
    begin
        if eventObject.Get('calendarId', tempJsonToken) then
            tempJsonToken.WriteTo(calendarId);

        if eventObject.Get('title', tempJsonToken) then
            tempJsonToken.WriteTo(title);

        if eventObject.Get('isAllday', tempJsonToken) then
            tempJsonToken.WriteTo(isAlldayTxt);

        if isAlldayTxt.Replace('"', '') = 'true' then
            isAllday := true;

        eventStartDateTime := ProcessChangedDateTime(eventObject, 'start');
        eventEndDateTime := ProcessChangedDateTime(eventObject, 'end');

        Clear(newEventTable);
        newEventTable.Init();
        newEventTable.Title := title.Replace('"', '');
        case calendarId.Replace('"', '') of
            'cal1':
                eventColor := eventColor::cal1;
            'cal2':
                eventColor := eventColor::cal2;
            'cal3':
                eventColor := eventColor::cal3;
            'cal4':
                eventColor := eventColor::cal4;
            else
                eventColor := eventColor::cal1;
        end;
        newEventTable.Color := eventColor;
        newEventTable."Start Date" := eventStartDateTime;
        newEventTable."End Date" := eventEndDateTime;
        newEventTable."All Day Event" := isAllday;
        newEventTable.Insert(true);
    end;

    procedure ProcessChangedDateTime(changedObject: JsonObject; Type: Text): DateTime
    var
        resultDateTimeTxt: Text;
        tempJsonToken: JsonToken;
        tempJsonTokenD: JsonToken;
        tempJsonTokenDd: JsonToken;
        TypeHelper: Codeunit "Type Helper";
        eventDateTime: DateTime;
        UTC: DateTime;
        TimezoneOffset: Duration;
    begin
        if not TypeHelper.GetUserTimezoneOffset(TimezoneOffset) then
            TimezoneOffset := 0;

        if not changedObject.Get(Type, tempJsonToken) then
            exit;

        if not tempJsonToken.SelectToken('d', tempJsonTokenD) then
            exit;

        if not tempJsonTokend.SelectToken('d', tempJsonTokenDd) then
            exit;

        tempJsonTokenDd.WriteTo(resultDateTimeTxt);
        eventDateTime := ConvertIsoDateTime(resultDateTimeTxt);

        UTC := eventDateTime + TimezoneOffset;
        exit(UTC);
    end;

    procedure ConvertIsoDateTime(isoDateTimeTxt: Text): DateTime
    var
        txtNewDate: Text;
        resultDateTime: DateTime;
    begin
        //  isoDateTimeTxt has additional ''

        txtNewDate := CopyStr(isoDateTimeTxt, 2, 4)
        + '-' + CopyStr(isoDateTimeTxt, 7, 2)
        + '-' + CopyStr(isoDateTimeTxt, 10, 2)
        + ' ' + CopyStr(isoDateTimeTxt, 13, 2)
        + ':' + CopyStr(isoDateTimeTxt, 16, 2)
        + ':' + CopyStr(isoDateTimeTxt, 19, 2);
        Evaluate(resultDateTime, txtNewDate);

        exit(resultDateTime);
    end;

    var
        eventTable: Record ar_Event;
}