﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Machine.Specifications;
using dokuku.sales.config;
using dokuku.sales.customer.repository;
using dokuku.sales.customer.model;
using dokuku.sales.customer.Service;
using MongoDB.Bson;

namespace dokuku.sales.fixture
{
    [Subject("Search Customer")]
    public class When_search_customer
    {
        private static ICustomerService csService;
        private static ICustomerReportRepository csReportRepo;
        private static Guid id1;
        private static Guid id2;
        private static Guid id3;
        static MongoConfig mongo;
        static string ownerId = "oetawan@inforsys.co.id";

        Establish context = () =>
            {
                mongo = new MongoConfig();
                csService = new CustomerService(mongo,null);
                csReportRepo = new CustomerReportRepository(mongo);
                id1 = Guid.NewGuid();
                id2 = Guid.NewGuid();
                id3 = Guid.NewGuid();
            };
        Because of = () =>
        {
            csService.SaveCustomer(BsonDocument.Create(new Customer()
            {
                _id = id1,
                OwnerId = ownerId,
                BillingAddress = "Seipana",
                City = "Batam",
                Currency = "IDR",
                Email = "oetawan.ac@gmail.com",
                Salutation = "Mr. ",
                FirstName = "Oet",
                LastName = "Chandra",
                Fax = "472111",
                MobilePhone = "082173739678",
                Name = "Bulan redup",
                Phone = "0778472111",
                PostalCode = "29432",
                State = "Kepri"
            }).ToJson(),ownerId);
            csService.SaveCustomer(BsonDocument.Create(new Customer()
            {
                _id = id2,
                OwnerId = ownerId,
                BillingAddress = "Seipana",
                City = "Sei Panas",
                Currency = "IDR",
                Email = "oetawan.ac@gmail.com",
                Salutation = "Mr. ",
                FirstName = "Mar",
                LastName = "Lo",
                Fax = "472111",
                MobilePhone = "082173739678",
                Name = "Bulan bintang",
                Phone = "0778472111",
                PostalCode = "29432",
                State = "Kepri"
            }).ToJson(),ownerId);
            csService.SaveCustomer(BsonDocument.Create(new Customer()
            {
                _id = id3,
                OwnerId = ownerId,
                BillingAddress = "Seipana",
                City = "Sei Panas",
                Currency = "IDR",
                Email = "oetawan.ac@gmail.com",
                Salutation = "Mr. ",
                FirstName = "Thin",
                LastName = "Kot",
                Fax = "472111",
                MobilePhone = "082173739678",
                Name = "Matahari",
                Phone = "0778472111",
                PostalCode = "29432",
                State = "Kepri"
            }).ToJson(),ownerId);
        };
        It should_return_customerreports = () =>
            {
                IEnumerable<CustomerReports> custs = csReportRepo.Search(ownerId,new string[] {"Bulan"});
                custs.Count().Equals(2);
                custs = csReportRepo.Search(ownerId, new string[] { "Bulan bintang" });
                custs.Count().Equals(1);
                custs = csReportRepo.Search(ownerId, new string[] { "oetawan@inforsys.co.id" });
                custs.Count().Equals(3);
            };
        Cleanup cleanup = () =>
            {
                csService.DeleteCustomer(id1);
                csService.DeleteCustomer(id2);
                csService.DeleteCustomer(id3);
            };
    }
}
