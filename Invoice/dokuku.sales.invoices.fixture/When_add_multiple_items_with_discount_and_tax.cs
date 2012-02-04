﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ncqrs.Spec;
using dokuku.sales.invoices.commands;
using dokuku.sales.invoices.events;
using dokuku.sales.invoices.domain;
using NUnit.Framework;

namespace dokuku.sales.invoices.fixture
{
    [Specification]
    public class When_add_multiple_items_with_discount_and_tax : OneEventTestFixture<AddInvoiceItem, InvoiceItemAdded>
    {
        Guid _customerId;
        Guid _invoiceItemId;
        public When_add_multiple_items_with_discount_and_tax()
        {
            this.SetupInvoiceFixture();
            _customerId = new Guid("DCCD617E-6083-4FAA-A328-15ADD3771DBC");
            _invoiceItemId = new Guid("6D810987-F3A1-4826-8AFE-294B64C097F0");
        }
        protected override IEnumerable<object> GivenEvents()
        {
            IList<object> events = new GivenEvents_First_ItemAdded().Events;
            return events;
        }
        protected override AddInvoiceItem WhenExecuting()
        {
            return new AddInvoiceItem
            {
                OwnerId = "mart@y.c",
                UserName = "marthin",
                InvoiceId = EventSourceId,
                ItemId = _invoiceItemId,
                Description = "untuk beli hp nokia",
                Quantity = 10,
                Price = 500000,
                DiscountInPercent = 10,
                TaxCode = "PPN"
            };
        }

        [Then]
        public void should_have_the_correct_item_event()
        {
            Assert.That(TheEvent, Is.EqualTo(new InvoiceItemAdded
            {
                OwnerId = "mart@y.c",
                UserName = "marthin",
                InvoiceId = EventSourceId,
                ItemId = _invoiceItemId,
                Description = "untuk beli hp nokia",
                Quantity = 10,
                Price = 500000,
                DiscountInPercent = 10,
                DiscountAmount = 500000,
                TaxCode = "PPN",
                TaxAmount = 450000,
                Summary = new Summary()
                {
                    SubTotal = 9000000,
                    DiscountTotal = 0,
                    NetTotal = 9450000,
                    Taxes = new TaxSummary[1] { new TaxSummary{ TaxCode = "PPN", TaxAmount = 450000 } }
                },
                Total = 4500000,
                ItemNumber = 2
            }));
        }
    }
}