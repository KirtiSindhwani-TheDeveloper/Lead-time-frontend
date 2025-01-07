export const brandColumnObject:any={
    
   "22": { //honda2w
        columns:{
            PO:["order number",'supplier name','order status','purchase order type','part number','quantity requested',
                'mrns actual received qty','invoiced qty','order date','mrn date','invoice date po',
                'network code',
            ],
        }

    },
    "17": { //tatcv
        columns:{
            PO:["order",'part','recd qty','status','ware house name','payer code',
                'division name','transaction date','purchaseorderdate','invoicedate','spares order type',
                'sap order num','commit flag'
            ],
        }

    },
    "28": { //tatapc
        columns:{
            PO:["order",'part','recd qty','status','ware house name','payer code',
                'division name','transaction date','purchaseorderdate','invoicedate','spares order type',
                'sap order num','commit flag'
            ],
        }

    },
    "20": { //hero
        columns:{
            PO:["part number",'purchase order number','order status','order date','invoice date','grn invoice date',
                'order subtype','order quantity','invoice quantity'
            ],
        }

    },
    "12": { //renault
        columns:{
            PO:["supplier type",'po number','order submission date','order sub type','order part number','order quantity',          
            ],
            MRN:['transaction date','supplier invoice date','supplier type','dms order number','part no',
                'shipped quantity','receipt quantity'
            ]
        }
    },
    "9": { //MAHINDRA
        columns:{
            PO:["po release date",'po type','po status','po number','po group','po line item status',
                'po rejection reason','part no','so qty'          
            ],
            MRN:['receipt date','invoice date','po number','party type','part number',
                'received qty','invoice qty'
            ]
        }
    },
    "32": { //JCB
        columns:{
            PO:["branch name",'order no','vendor','order ref no','ordtype','material no',
                'ord date','ordqty'          
            ],
            MRN:['branch','order no','jcbinvdt','grn date','part code',
                'qty'
            ]
        }
    },
    "11": { //Hyundai
        columns:{
            PO:["order no",'part no order','part no current','part name','quantity order','quantity current',
                'po date','pdc'          
            ],
            MRN:['po no','part no','invoice date','gr date','rcv qty',
                
            ]
        }
    },
    "33": { //Kia
        columns:{
            PO:["order no",'part no order','part no current','part name','quantity order','quantity current',
                'po date','pdc'          
            ],
            MRN:['po no','part no','invoice date','gr date','rcv qty',
                
            ]
        }
    },


}