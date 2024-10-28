page 50000 ar_EventsList
{
    Caption = 'Events List';
    PageType = List;
    ApplicationArea = All;
    UsageCategory = Lists;
    SourceTable = ar_Event;
    Editable = true;
    DelayedInsert = true;

    layout
    {
        area(Content)
        {
            repeater(MainColumns)
            {
                field("No."; Rec."No.")
                {
                    ApplicationArea = All;
                }
                field(Title; Rec.Title)
                {
                    ApplicationArea = All;
                }
                field(Description; Rec.Description)
                {
                    ApplicationArea = All;
                }
                field(Color; Rec.Color)
                {
                    ApplicationArea = All;
                }
                field("Start Date"; Rec."Start Date")
                {
                    Editable = NOT Rec."All Day Event";
                    ApplicationArea = All;
                }
                field("End Date"; Rec."End Date")
                {
                    Editable = NOT Rec."All Day Event";
                    ApplicationArea = All;
                }
                field("All Day Event"; Rec."All Day Event")
                {
                    ApplicationArea = All;
                }
            }
        }
    }
}