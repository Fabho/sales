steal('jquery/controller',
      'jquery/view/ejs',
      'jquery/controller/view',
      './ItemEdit.css')
	.then('./views/editItem.ejs', function ($) {

	    $.Controller('sales.Controllers.items.edit',
            {
                defaults: ($this = null)
            },
            {
                init: function () {

                },
                load: function (id) {
                    $this = this;
                    var item = this.getItem(id);
                    this.element.html("//sales/controllers/items/edit/views/editItem.ejs", item);
                },
                getItem: function (id) {
                    var item = null;
                    $.ajax({
                        type: 'GET',
                        url: 'Items/_id/' + id,
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            item = data;
                        }
                    });
                    return item;
                },
                "#editItemsForm submit": function (el, ev) {
                    var form = $("#editItemsForm");
                    var id = $("#itemId").val();
                    var code = $("#itemCode").val();
                    var barcode = $("#barcode").val();
                    var name = $("#itemName").val();
                    var harga = $("#itemPrice").val();
                    var description = $("#description").val();
                    var taxName = $("#tax").text();
                    var taxValue = $("#tax").val();

                    var item = new Object;
                    item._id = id;
                    item.Code = code;
                    item.Barcode = barcode;
                    item.Name = name;
                    item.Rate = harga;
                    item.Description = description;

                    item.Tax = new Object();
                    item.Tax.Name = taxName.trim();
                    item.Tax.Value = taxValue;
                    $.ajax({
                        type: "POST",
                        url: "/editItem",
                        data: { 'data': JSON.stringify(item) },
                        dataType: "json",
                        success: function (data) {
                            if (data.error) {
                                $this.onErrorRequestData(data.message);
                                return;
                            }
                            $("#body").sales_items_list("load");
                        }
                    });
                    ev.preventDefault();
                },
                onErrorRequestData: function (msg) {
                    var err = $("#errorEditItemDiv");
                    err.empty();
                    $('<li>', { text: msg }).appendTo(err.show());
                },
                "#cancelEditItem click": function () {
                    $("#body").sales_items_list("load");
                }
            })
	});