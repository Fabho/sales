steal('jquery/controller',
      'jquery/view/ejs',
      'jquery/controller/view',
      './ItemsCreate.css',
      'sales/scripts/ModalDialog.js',
      'sales/styles/ModalDialog.css',
      'sales/repository/CurrencyandTaxRepository.js')

.then('./views/createTaxDialog.ejs',
      './views/init.ejs', function ($) {
          $.Controller('sales.Controllers.items.create',
        {
            defaults: ($this = null)
        },
        {
            init: function () {
                $this = this;
                curTaxRepo = new CurrencyandTaxRepository();
                this.element.html(this.view("//sales/controllers/items/create/views/init.ejs"));
                this.loadDataTax();

            },
            load: function () {
                $this = this;
                curTaxRepo = new CurrencyandTaxRepository();
                this.element.html(this.view("//sales/controllers/items/create/views/init.ejs"));
                this.loadDataTax();
            },
            loadDataTax: function () {
                var tax = curTaxRepo.getAllTax();
                $.each(tax, function (i) {
                    $("#tax").append("<option value='" + tax[i].Value + "'>" + tax[i].Code + "</option>");
                });
            },
            "#createTaxLink click": function (el, ev) {
                this.createTaxDialog();
                ev.preventDefault();
                this.triggerNewEvent();
            },
            createTaxDialog: function () {
                new ModalDialog("Pajak Baru");
                $("#dialogContent").html(this.view("//sales/controllers/items/create/views/createTaxDialog.ejs"));
            },
            triggerNewEvent: function () {
                $(".submitTax").click(this.submitTax);
                $("#cancelCreateTax").click(this.cancelCreateTaxClick);
                $("#taxName").keypress(this.taxNameKeypress);
                $("#percentTax").keypress(this.percentTaxKeypress);
            },
            "#createItemsForm submit": function (el, ev) {
                var code = $("#itemCode").val();
                var barcode = $("#barcode").val();
                var name = $("#itemName").val();
                var harga = $("#itemPrice").val();
                var description = $("#description").val();
                var taxName = $("#tax option:selected").text(); //$("#tax").text();
                var taxValue = $("#tax").val();

                var item = new Object;
                item.Code = code;
                item.Barcode = barcode;
                item.Name = name;
                item.Rate = harga;
                item.Description = description;

                item.Tax = new Object();
                item.Tax.Code = taxName.trim();
                item.Tax.Value = taxValue;

                $.ajax({
                    type: "POST",
                    url: "/createnewitem",
                    data: { 'data': JSON.stringify(item) },
                    dataType: "json",
                    success: function (data) {
                        if (data.error == "true") {
                            $this.onErrorRequestData(data.message);
                            return;
                        }
                        $("#body").sales_items_list("load");
                    }

                });
                ev.preventDefault();

            },
            onErrorRequestData: function (msg) {
                var err = $("#errorCreateItemDiv");
                err.empty();
                $('<li>', { text: msg }).appendTo(err.show());
            },
            submitTax: function (el, ev) {
                var form = $("#taxForm");
                var err = $("#errorCreateTaxDiv");
                var defaults = {
                    name: $("#taxName").val(),
                    percent: $("#percentTax").val()
                };
                var tax = new Object();
                tax.Name = defaults.name;
                tax.Value = defaults.percent;

                err.empty();
                if (defaults.name !== "" && defaults.percent != 0)
                    curTaxRepo.SaveTax(tax);
                $("#tax").append("<option value='" + defaults.percent + "'>" + defaults.name + "</option>");
                $(".ModalDialog").remove();

                if (defaults.name == "")
                    $('<li>', { 'class': 'name', text: "Nama Pajak harus di isi" }).appendTo(err.show());
                if (defaults.percent == "")
                    $('<li>', { 'class': 'percenttax', text: "Persentase Pajak harus yydiisi" }).appendTo(err.show());
                if (defaults.percent <= 0)
                    $('<li>', { 'class': 'percenttax', text: "Persentase Pajak harus lebih besar dari nol" }).appendTo(err.show());
                return;
            },
            taxNameKeypress: function () {
                $('li.name').remove();
                if ($("#errorCreateTaxDiv").is(':empty'))
                    $("#errorCreateTaxDiv").hide();
            },
            percentTaxKeypress: function () {
                $('li.percenttax').remove();
                if ($("#errorCreateTaxDiv").is(':empty'))
                    $("#errorCreateTaxDiv").hide();
            },
            cancelCreateTaxClick: function () {
                $("#taxName").val("");
                $("#percentTax").val("");
                $(".ModalDialog").remove();
            },
            "#cancelCreateItem click": function () {
                $("#itemName").val("");
                $("#description").val("");
                $("#itemPrice").val("");
                $("#tax").val("");
                $("#body").sales_items_list("load");
            },
            "#itemCode blur": function () {
                $.ajax({
                    type: 'GET',
                    url: '/isCodeIsExist/' + $("#itemCode").val(),
                    dataType: 'json',
                    success: function (data) {
                        var messageArea = $(".Code"),
                        imgVerify = null,
                        message = null;
                        messageArea.empty();
                        if (!data) {
                            imgVerify = $('<div>', { 'class': 'exist' });
                            message = $('<span>', { 'class': 'existMessage', text: 'Kode barang sudah digunakan' });
                        } else {
                            imgVerify = $('<div>', { 'class': 'notExist' });
                            message = $('<span>', { 'class': 'notExistMessage', text: 'Kode barang dapat digunakan' });
                        }
                        imgVerify.appendTo(messageArea.show());
                        message.insertAfter(imgVerify);
                    }
                });
            },
            "#barcode blur": function () {
                $.ajax({
                    type: 'GET',
                    url: '/isBarcodeIsExist/' + $("#barcode").val(),
                    dataType: 'json',
                    success: function (data) {
                        var messageArea = $(".Barcode"),
                        imgVerify = null,
                        message = null;
                        messageArea.empty();
                        if (!data) {
                            imgVerify = $('<div>', { 'class': 'exist' });
                            message = $('<span>', { 'class': 'existMessage', text: 'Barcode barang sudah digunakan' });
                        } else {
                            imgVerify = $('<div>', { 'class': 'notExist' });
                            message = $('<span>', { 'class': 'notExistMessage', text: 'Barcode barang dapat digunakan' });
                        }
                        imgVerify.appendTo(messageArea.show());
                        message.insertAfter(imgVerify);
                    }
                });
            },
            "input keypress": function (el, ev) {
                if (el.not($(":button"))) {
                    if (ev.keyCode == 13) {
                        var iname = el.val();
                        if (iname !== 'Simpan') {
                            var fields = el.parents('form:eq(0),body').find('button, input, textarea, select');
                            var index = fields.index(el);
                            if (index > -1 && (index + 1) < fields.length) {
                                fields.eq(index + 1).focus();
                            }
                            return false;
                        }
                    }
                }
            },
            "select keypress": function (el, ev) {
                if (el.not($(":button"))) {
                    if (ev.keyCode == 13) {
                        var iname = el.val();
                        if (iname !== 'Simpan') {
                            var fields = el.parents('form:eq(0),body').find('button, input, textarea, select');
                            var index = fields.index(el);
                            if (index > -1 && (index + 1) < fields.length) {
                                fields.eq(index + 1).focus();
                            }
                            return false;
                        }
                    }
                }
            }
        })
      });
