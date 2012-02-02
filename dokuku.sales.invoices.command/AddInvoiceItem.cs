﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ncqrs.Commanding.CommandExecution.Mapping.Attributes;
using Ncqrs.Commanding;
using dokuku.sales.invoices.events;
namespace dokuku.sales.invoices.command
{
    [Serializable]
    [MapsToAggregateRootMethod("dokuku.sales.invoices.Invoices,dokuku.sales.invoices", "AddInvoiceItem")]
    public class AddInvoiceItem : CommandBase
    {
        [Parameter(1)]
        public Guid InvoiceId { get; set; }
        [Parameter(2)]
        public InvoiceItem Item { get; set; }
        [Parameter(3)]
        public string UserName { get; set; }
    }
}
