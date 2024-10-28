pageextension 50000 ar_MarketingSetupExt extends "Marketing Setup"
{
    layout
    {
        addlast(Numbering)
        {
            field(ar_EventNos; Rec.ar_EventNos)
            {
                ApplicationArea = All;
            }
        }
    }
}