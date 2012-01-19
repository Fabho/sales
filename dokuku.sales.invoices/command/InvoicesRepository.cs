﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using dokuku.sales.config;
using System.Configuration;
using MongoDB.Driver;
using dokuku.sales.invoices.model;
using MongoDB.Driver.Builders;
namespace dokuku.sales.invoices.command
{
    public class InvoicesRepository : IInvoicesRepository
    {
        MongoConfig mongo;
        public InvoicesRepository(MongoConfig mongo)
        {
            this.mongo = mongo;
        }

        public void Save(Invoices invoice)
        {
            Collections.Save<Invoices>(invoice);
        }

        public void UpdateInvoices(Invoices invoice)
        {
            var qry = Query.EQ("_id", invoice._id);
            var update = Update.Replace<Invoices>(invoice);
            Collections.Update(qry, update);
            updateIndex(invoice);
        }

        private void updateIndex(Invoices inv)
        {
            var qry = Query.EQ("_id", inv._id);
            var update = Update.Replace<Invoices>(inv);
            Collections.Update(qry, update);
        }

        public Invoices Get(string id, string ownerId)
        {
            var qry = Query.And(
                Query.EQ("_id", id),
                Query.EQ("OwnerId", ownerId));
            
            return Collections.FindOneAs<Invoices>(qry);
        }

        public void Delete(string id, string ownerId)
        {
            Collections.Remove(Query.And(
                Query.EQ("_id", id),
                Query.EQ("OwnerId", ownerId)));
        }
        
        private MongoCollection<Invoices> Collections
        {
            get
            {
                return mongo.MongoDatabase.GetCollection<Invoices>(typeof(Invoices).Name);
            }
        }
    }
}